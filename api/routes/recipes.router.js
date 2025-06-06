const express = require('express')
const pool = require('../modules/pool')
const router = express.Router()

// TODO REFACTOR


// PUT single text box edits
router.put('/putDetail/:id', async (req, res) => {
    const target_id = req.params.id
    const { type } = req.body
    let { formatDetail } = req.body
    console.log('putDetails', target_id, type, formatDetail)

    const queryEditTexts = {
        title: `UPDATE moms_recipes SET title = $1 WHERE id = $2;`,
        prep_time: `UPDATE moms_recipes SET prep_time = $1 WHERE id = $2;`,
        servings: `UPDATE moms_recipes SET servings = $1 WHERE id = $2;`,
        description: `UPDATE moms_recipes SET description = $1 WHERE id = $2;`,
        ingredient: `UPDATE recipe_ingredients SET ingredient_id = $1 WHERE id = $2;`,
        quantity: `UPDATE recipe_ingredients SET quantity = $1 WHERE id = $2;`,
        measurement: `UPDATE recipe_ingredients SET measurement = $1 WHERE id = $2;`,
        step_number: `UPDATE moms_steps SET step_number = $1 WHERE id = $2;`,
        instructions: `UPDATE moms_steps SET instructions = $1 WHERE id = $2;`,
    }
    const postIngredientText = `INSERT INTO "moms_ingredients" ("ingredient") VALUES ($1) RETURNING id;`

    const isNumber = !isNaN(Number(formatDetail))

    const queryText = queryEditTexts[type]
    console.log('queryText', queryText)

    try {

        if (type === 'ingredient' && !isNumber) {
            // console.log('ingredient does not exist', formatDetail)
            const results = await pool.query(postIngredientText, [formatDetail])
            formatDetail = results.rows[0].id
            // console.log('formatDetails returned id', formatDetail)
        }
        // final put
        console.log(typeof formatDetail)
        console.log('right before PUT')
        await pool.query(queryText, [formatDetail, target_id])
        console.log('SUCCESS PUT new')
        res.sendStatus(201)
    } catch (error) {
        console.log('PUT new error', error)
        res.sendStatus(500)
    }
})


// PUT new photo url
router.put('/putNewPhoto/:id', (req, res) => {
    const recipeId = req.params.id
    const newPhoto = req.body.data.properties
    console.log('putNewPhoto', recipeId, newPhoto)

    const newPhotoText = `UPDATE moms_recipes SET picture = $1 WHERE id = $2;`
    pool.query(newPhotoText, [newPhoto, recipeId]).then((result) => {
        console.log('new photo success')
        res.sendStatus(201)
    }).catch((error) => {
        console.log('error in new photo', error)
        res.sendStatus(500)
    })
})

// REMOVE/Delete sub recipe
router.delete('/removeSubRecipe/:id', async (req, res) => {
    const subId = req.params.id
    const parentId = req.body.parentId
    console.log('parentId', req.body.parentId)
    console.log('removing sub', subId, 'from', parentId)

    const deleteRelationsText = `DELETE FROM "recipe_relationship" WHERE "parent_id" = $1 AND "sub_id" = $2;`
    const isParentText = `SELECT * FROM "recipe_relationship" WHERE "parent_id" = $1;`
    const isSubText = `SELECT * FROM "recipe_relationship" WHERE "sub_id" = $1;`
    const notParentText = `UPDATE "moms_recipes" SET "is_parent_recipe" = false WHERE "id" = $1;`
    const notSubRecipe = `UPDATE "moms_recipes" SET "is_sub_recipe" = false WHERE "id" = $1;`

    try {
        // remove subId from parent
        await pool.query(deleteRelationsText, [parentId, subId])

        // check if parentId is still a parent
        const parentResults = await pool.query(isParentText, [parentId])
        if (parentResults.rows.length === 0) {
            await pool.query(notParentText, [parentId])
        }

        // check if subId is still a subId
        const stillSubResults = await pool.query(isSubText, [subId])
        if (stillSubResults.rows.length === 0) {
            await pool.query(notSubRecipe, [subId])
        }


        res.sendStatus(201)
    } catch (error) {
        console.log('error in removing the sub recipe', error)
        res.sendStatus(500)
    }
})

// POST sub recipes only
router.post('/postOnlySubRecipes', async (req, res) => {
    const recipeID = req.body.displayId
    const subRecipePackage = req.body.typePackage
    console.log('backend sub recipe package', recipeID, subRecipePackage)
    const subRecipeText = `INSERT INTO "recipe_relationship" ("parent_id", "sub_id") VALUES ($1, $2);`
    const isSubRecipeText = `UPDATE moms_recipes SET is_sub_recipe = true WHERE id = $1;`
    const isParentRecipeText = `UPDATE moms_recipes SET is_parent_recipe = true WHERE id = $1;`
    const hasSubRecipesText = `SELECT sub_id FROM "recipe_relationship" WHERE parent_id = $1;`
    // todo block posting if a sub recipe is already there...

    try {
        // ! recipe_relationship post sub recipes need: new Recipe ID (parent) // you have the sub recipe ID's
        // ! switch any sub recipes is_sub_recipe = true
        const alreadyHasSub = await pool.query(hasSubRecipesText, [recipeID])
        console.log('alreadyHasSub', alreadyHasSub.rows)
        const previousSubRecipes = alreadyHasSub.rows.map((sub) => sub.sub_id)
        console.log('previousSubRecipes', previousSubRecipes)


        const subPromises = subRecipePackage.map(async (sub) => {
            if (recipeID === sub.id) {
                console.log('cannot have self relationship')
                return
            } else if (previousSubRecipes.includes(sub.id)) {
                console.log('already a sub recipe - duplicate')
                return
            }
            await pool.query(subRecipeText, [recipeID, sub.id]) // post relationship
            await pool.query(isParentRecipeText, [recipeID]) // change is parent recipe
            await pool.query(isSubRecipeText, [sub.id]) // change is_sub_recipe
            return
        })
        await Promise.all(subPromises)
        res.sendStatus(201)
    } catch (error) {
        console.log('error in posting sub recipes only', error)
        res.sendStatus(500)
    }
})


// DELETE step solo
router.delete('/deleteRecipeStep/:id', (req, res) => {
    console.log('req.params.id', req.params.id)
    const queryText = 'DELETE FROM "moms_steps" WHERE "id" = $1;'

    pool.query(queryText, [req.params.id]).then((result) => {
        console.log('deleted individual step')
        res.sendStatus(201)
    }).catch((error) => {
        console.log('error in deleting step', error)
        res.sendStatus(500)
    })
})
// POST steps only
router.post('/postOnlySteps', async (req, res) => {
    const recipeID = req.body.displayId
    const stepPackage = req.body.typePackage

    console.log('stepPackage', stepPackage)

    const highestStepQuery = `SELECT MAX(step_number) FROM moms_steps WHERE recipe_id = $1;`
    const stepText = `INSERT INTO "moms_steps" ("recipe_id", "step_number", "instructions") VALUES ($1, $2, $3);`

    try {
        const lastStepResult = await pool.query(highestStepQuery, [recipeID])
        let lastStep = lastStepResult.rows[0].max

        const stepPromises = stepPackage.map((step, i) => {
            console.log('STEP', step.instructions)
            const stepNumber = (lastStep ?? 0) + i + 1
            return pool.query(stepText, [recipeID, stepNumber, step.instructions])
        })
        await Promise.all(stepPromises)

        res.sendStatus(200)
    } catch (error) {
        console.log('error in postOnlySteps', error)
        res.sendStatus(500)
    }
})


// DELETE single Ingredient
router.delete('/deleteRecipeIngredient/:id', (req, res) => {
    console.log('req.params.id', req.params.id)
    const queryText = 'DELETE FROM "recipe_ingredients" WHERE "id" = $1;'

    pool.query(queryText, [req.params.id]).then((result) => {
        console.log('deleted individual ingredient')
        res.sendStatus(201)
    }).catch((error) => {
        console.log('error in deleting ingredient', error)
        res.sendStatus(500)
    })
})
// POST ingredients only
router.post('/postOnlyIngredients', async (req, res) => {
    const recipeID = req.body.displayId
    const ingredientPackage = req.body.typePackage
    console.log('ingredients only', recipeID, ingredientPackage)
    const ingredientText = `INSERT INTO "moms_ingredients" ("ingredient") VALUES ($1) RETURNING id;`
    const postIngredientText = `INSERT INTO "recipe_ingredients" ("recipe_id", "ingredient_id", "quantity", "measurement") VALUES ($1, $2, $3, $4);`

    // ! SAME
    // ! moms_ingredients post new ingredients, return id's 
    // ! recipe_ingredients post specified ingredients recipe_id (newRecipe ID), ingredient_id
    try {
        const ingredientPromises = ingredientPackage.map(async (ingredientObject) => {
            if (ingredientObject.id === 'zero') {
                const result = await pool.query(ingredientText, [ingredientObject.ingredient])
                const newId = result.rows[0].id
                ingredientObject.id = newId
                const { id, measurement, quantity } = ingredientObject
                await pool.query(postIngredientText, [recipeID, id, quantity, measurement])
            } else {
                const { id, measurement, quantity } = ingredientObject
                await pool.query(postIngredientText, [recipeID, id, quantity, measurement])
            }
        })
        await Promise.all(ingredientPromises)
        res.sendStatus(201)
    } catch (error) {
        console.log('error in adding ingredients only', error)
        res.sendStatus(500)
    }
})



// POST only tags
router.post('/postOnlyTags', async (req, res) => {
    const recipeID = req.body.displayId
    const tagPackage = req.body.typePackage
    console.log('THE PACKAGE', recipeID, tagPackage)

    const tagText = `INSERT INTO "moms_tags" ("tag") VALUES ($1) RETURNING id;`
    const postTagText = `INSERT INTO "recipe_tags" ("recipe_id", "tags_id") VALUES ($1, $2);`

    try {
        // todo consolidate, same function for tags in master
        // ! moms_tags post new tags, return id's
        // ! recipe_tags post specified tags recipe_id tags_id
        const tagPromises = tagPackage.map(async (tagObject) => {
            if (tagObject.id === 'zero') {
                const result = await pool.query(tagText, [tagObject.tag])
                const newId = result.rows[0].id
                // todo ! Do I need to put this in the object, or can I just use it as the id? 
                tagObject.id = newId
                const { id } = tagObject
                await pool.query(postTagText, [recipeID, id])
            } else {
                const { id } = tagObject
                await pool.query(postTagText, [recipeID, id])
            }
        })
        await Promise.all(tagPromises)
        console.log('success in posting new tags!')
        res.sendStatus(201)
    } catch (error) {
        console.log('error in posting new tags!', error)
        res.sendStatus(500)
    }
})
// DELETE solo recipe Tag
router.delete('/deleteRecipeTag/:id', (req, res) => {
    console.log('req.params.id', req.params.id)
    const queryText = 'DELETE FROM "recipe_tags" WHERE "id" = $1;'

    pool.query(queryText, [req.params.id]).then((result) => {
        console.log('deleted individual tag')
        res.sendStatus(201)
    }).catch((error) => {
        console.log('error in deleting tag', error)
        res.sendStatus(500)
    })
})


// DELETE ENTIRE RECIPE
router.delete('/deleteEntireRecipe/:id', async (req, res) => {
    console.log('params', req.params)

    const recipeId = req.params.id
    const isParentText = `SELECT is_parent_recipe FROM moms_recipes WHERE id = $1;`
    const isSubText = `SELECT is_sub_recipe FROM moms_recipes WHERE id = $1;`

    const getSubsOfParent = `SELECT "sub_id" FROM "recipe_relationship" WHERE "parent_id" = $1`
    const getParentIds = `SELECT "parent_id" FROM "recipe_relationship" WHERE "sub_id" = $1`
    const updateSubRecipeFalseText = `UPDATE moms_recipes SET is_sub_recipe = false WHERE id = $1`
    const updateParentRecipeFalseText = `UPDATE moms_recipes SET is_parent_recipe = false WHERE id = $1`
    
    const getParentsOfSub = `SELECT "parent_id" FROM "recipe_relationship" WHERE "sub_id" = $1`
    const getSubIds = `SELECT "sub_id" FROM "recipe_relationship" WHERE "parent_id" = $1`
    
    const deleteParentRelations = `DELETE FROM "recipe_relationship" WHERE "parent_id" = $1;`
    const deleteSubRelations = `DELETE FROM "recipe_relationship" WHERE "sub_id" = $1;`
    const deleteTagsText = `DELETE FROM "recipe_tags" WHERE "recipe_id" = $1;`
    const deleteIngredientsText = `DELETE FROM "recipe_ingredients" WHERE "recipe_id" = $1;`
    const deleteStepsText = `DELETE FROM "moms_steps" WHERE "recipe_id" = $1;`
    const deleteRecipeText = `DELETE FROM "moms_recipes" WHERE "id" = $1;`


    try {

        // identify if it's a parent or sub recipe
        const isParentResult = await pool.query(isParentText, [recipeId])
        const isSubResult = await pool.query(isSubText, [recipeId])
        const isParent = isParentResult.rows[0].is_parent_recipe
        const isSub = isSubResult.rows[0].is_sub_recipe
        console.log('isParent', isParent)
        console.log('isSub', isSub)

        if (isParent) {
            console.log('its a parent!')
            // if PARENT...
            // recipe relations - switch to is_sub false if no parents
            const potentialNonSubRecipes = await pool.query(getSubsOfParent, [recipeId])
            // delete the parent recipe from relationship table
            await pool.query(deleteParentRelations, [recipeId])
            // check to see if sub recipes attached to the deleted still have parents
            const subCheckPromises = potentialNonSubRecipes.rows.map(async (sub) => {
                const parentRecipes = await pool.query(getParentIds, [sub.sub_id])
                const hasParent = parentRecipes.rows.length > 0
                if (!hasParent) {
                    await pool.query(updateSubRecipeFalseText, [sub.sub_id])
                }
            })
            await Promise.all(subCheckPromises)

        } else if (isSub) {
            console.log('its a sub!')
            // if SUB...
            // recipe relations - switch to is_parent false if no parents
            // get potential non - parents
            const potentailNonParentRecipes = await pool.query(getParentsOfSub, [recipeId])
            console.log('potential non parents', potentailNonParentRecipes.rows)
            // delete the relations table data
            await pool.query(deleteSubRelations, [recipeId])
            // check to see if parent recipes attached to the deleted still have subs
            const parentCheckPromises = potentailNonParentRecipes.rows.map(async (par) => {
                console.log('par.parent_id', par.parent_id)
                const subRecipes = await pool.query(getSubIds, [par.parent_id])
                const hasSub = subRecipes.rows.length > 0
                console.log('hasSub', hasSub)
                if (!hasSub) {
                    await pool.query(updateParentRecipeFalseText, [par.parent_id])
                }
            })
            await Promise.all(parentCheckPromises)
        }



        // recipe tags
        await pool.query(deleteTagsText, [recipeId])

        // recipe ingredients
        await pool.query(deleteIngredientsText, [recipeId])

        // moms steps
        await pool.query(deleteStepsText, [recipeId])

        // moms recipes
        await pool.query(deleteRecipeText, [recipeId])


        res.sendStatus(201)
    } catch (error) {
        console.log('Error in Delete Entire', error)
        res.sendStatus(500)
    }
})
// POST new ENTIRE recipe
router.post('/newRecipe', async (req, res) => {
    const newRecipeDetails = req.body.newRecipeDetails
    const newSteps = req.body.stepPackage
    const newSubRecipes = req.body.subRecipePackage
    const newIngredients = req.body.ingredientPackage
    const newTags = req.body.tagPackage

    const detailsText = `INSERT INTO "moms_recipes" 
    ("title", "description", "prep_time", "servings", "is_parent_recipe", "picture")
    VALUES ($1, $2, $3, $4, $5, $6) RETURNING id;`
    const stepText = `INSERT INTO "moms_steps" ("recipe_id", "step_number", "instructions") VALUES ($1, $2, $3);`
    const subRecipeText = `INSERT INTO "recipe_relationship" ("parent_id", "sub_id") VALUES ($1, $2);`
    const isSubRecipeText = `UPDATE moms_recipes SET is_sub_recipe = true WHERE id = $1;`
    const isParentRecipeText = `UPDATE moms_recipes SET is_parent_recipe = true WHERE id = $1;`
    const ingredientText = `INSERT INTO "moms_ingredients" ("ingredient") VALUES ($1) RETURNING id;`
    const postIngredientText = `INSERT INTO "recipe_ingredients" ("recipe_id", "ingredient_id", "quantity", "measurement") VALUES ($1, $2, $3, $4);`
    const tagText = `INSERT INTO "moms_tags" ("tag") VALUES ($1) RETURNING id;`
    const postTagText = `INSERT INTO "recipe_tags" ("recipe_id", "tags_id") VALUES ($1, $2);`


    try {
        // ** FILTERing is all done client side...

        // begin transaction 
        // await pool.query('BEGIN')        
        // console.log('begin')


        // ! moms_recipes post recipeDetails - return new recipe ID **
        const { newTitle, description, prep_time, servings, is_parent_recipe, picture } = newRecipeDetails
        const detailResults = await pool.query(detailsText, [newTitle, description, prep_time, servings, is_parent_recipe, picture])
        const newRecipeId = detailResults.rows[0].id


        // ! moms_steps post Steps w/ need: new Recipe ID
        // ! generate step#
        const stepPromises = newSteps.map((step, i) => {
            const stepNumber = i + 1
            pool.query(stepText, [newRecipeId, stepNumber, step.instructions])
            return
        })
        await Promise.all(stepPromises)


        // ! recipe_relationship post sub recipes need: new Recipe ID (parent) // you have the sub recipe ID's
        // ! switch any sub recipes is_sub_recipe = true
        if (newSubRecipes.length > 0) {
            await pool.query(isParentRecipeText, [newRecipeId]) // make a parent
            const subPromises = newSubRecipes.map(async (sub) => {
                await pool.query(subRecipeText, [newRecipeId, sub.id]) // post relationship
                await pool.query(isSubRecipeText, [sub.id]) // change is_sub_recipe
                return
            })
            await Promise.all(subPromises)
        }

        // ! moms_ingredients post new ingredients, return id's 
        // ! recipe_ingredients post specified ingredients recipe_id (newRecipe ID), ingredient_id
        const ingredientPromises = newIngredients.map(async (ingredientObject) => {
            if (ingredientObject.id === 'zero') {
                const result = await pool.query(ingredientText, [ingredientObject.ingredient])
                const newId = result.rows[0].id
                ingredientObject.id = newId
                const { id, measurement, quantity } = ingredientObject
                await pool.query(postIngredientText, [newRecipeId, id, quantity, measurement])
            } else {
                const { id, measurement, quantity } = ingredientObject
                await pool.query(postIngredientText, [newRecipeId, id, quantity, measurement])
            }
        })
        await Promise.all(ingredientPromises)

        // ! moms_tags post new tags, return id's
        // ! recipe_tags post specified tags recipe_id tags_id
        const tagPromises = newTags.map(async (tagObject) => {
            if (tagObject.id === 'zero') {
                const result = await pool.query(tagText, [tagObject.tag])
                const newId = result.rows[0].id
                tagObject.id = newId
                const { id } = tagObject
                await pool.query(postTagText, [newRecipeId, id])
            } else {
                const { id } = tagObject
                await pool.query(postTagText, [newRecipeId, id])
            }
        })
        await Promise.all(tagPromises)

        // todo add commit, begin and rollback transaction
        // commit transaction
        // await pool.query('COMMIT')
        // console.log('commit')

        res.status(201).send({ success: true, newRecipeId: newRecipeId })

    } catch (error) {
        // await pool.query('ROLLBACK')
        console.log('error in creating new recipe', error)
        // res.status(500).send({ success: false, error: error.message });
        res.sendStatus(500)
    }
})


// fetch all of categories
router.get('/titleCheck', (req, res) => {

    const queryText = `SELECT title FROM "moms_recipes";`

    pool.query(queryText).then((result) => {
        console.log(`/api/recipes/titleCheck success`)
        res.send(result.rows)
    }).catch((error) => {
        console.log(`/api/recipes/titleCheck ERROR`, error)
        res.sendStatus(500)
    })
})
router.get('/notParents', (req, res) => {

    const queryText = `SELECT id, title FROM "moms_recipes" WHERE is_parent_recipe = false;`

    pool.query(queryText).then((result) => {
        console.log(`/api/recipes/notParents success`)
        res.send(result.rows)
    }).catch((error) => {
        console.log(`/api/recipes/notParents ERROR`, error)
        res.sendStatus(500)
    })
})
router.get('/ingredients', (req, res) => {

    const queryText = `SELECT * FROM "moms_ingredients";`

    pool.query(queryText).then((result) => {
        console.log(`/api/recipes/ingredients success`)
        res.send(result.rows)
    }).catch((error) => {
        console.log(`/api/recipes/ingredients ERROR`, error)
        res.sendStatus(500)
    })
})
router.get('/tags', (req, res) => {

    const queryText = `SELECT * FROM "moms_tags";`

    pool.query(queryText).then((result) => {
        console.log(`/api/recipes/tags success`)
        res.send(result.rows)
    }).catch((error) => {
        console.log(`/api/recipes/tags ERROR`, error)
        res.sendStatus(500)
    })
})



// all recipes route
router.get('/all', (req, res) => {

    // const keywords = req.query.keywords
    const { keywords, limit, offset } = req.query
    const keywordArray = keywords.trim().toLowerCase().split(' ')
    // console.log('keywordArray', keywordArray)

    const browseQueryText = `SELECT * FROM moms_recipes ORDER BY RANDOM() LIMIT $1 OFFSET $2;`
    const allQueryText = `SELECT * FROM "moms_recipes" ORDER BY LOWER(title) LIMIT $1 OFFSET $2;`
    
    const filterQueryText = `
WITH 
-- Define search terms
search_terms AS (
    SELECT UNNEST($1::text[]) AS term
),

-- Find recipes by title
recipes_by_title AS (
    SELECT r.id, r.title, r.description, r.prep_time, r.servings, r.picture, 1 AS priority,
           COUNT(st.term) AS title_match_count,  -- Count occurrences in the title
           0 AS ingredient_match_count,  -- Placeholder for ingredient match count
           0 AS tag_match_count  -- Placeholder for tag match count
    FROM moms_recipes r
    JOIN search_terms st ON LOWER(r.title) LIKE '%' || st.term || '%'
    GROUP BY r.id, r.title, r.description, r.prep_time, r.servings, r.picture
),

-- Find recipes by ingredients (including sub-recipes)
recipes_by_ingredient AS (
    SELECT r.id, r.title, r.description, r.prep_time, r.servings, r.picture, 2 AS priority,
           0 AS title_match_count,  -- Placeholder for title match count
           COUNT(st.term) AS ingredient_match_count,  -- Count occurrences in ingredients
           0 AS tag_match_count  -- Placeholder for tag match count
    FROM moms_recipes r
    JOIN recipe_ingredients ri ON r.id = ri.recipe_id
    JOIN moms_ingredients i ON ri.ingredient_id = i.id
    JOIN search_terms st ON LOWER(i.ingredient) LIKE '%' || st.term || '%'
    GROUP BY r.id, r.title, r.description, r.prep_time, r.servings, r.picture

    UNION ALL

    SELECT parent.id, parent.title, parent.description, parent.prep_time, parent.servings, parent.picture, 2 AS priority,
           0 AS title_match_count,  -- Placeholder for title match count
           COUNT(st.term) AS ingredient_match_count,
           0 AS tag_match_count
    FROM moms_recipes parent
    JOIN recipe_relationship rr ON parent.id = rr.parent_id
    JOIN moms_recipes sub ON rr.sub_id = sub.id
    JOIN recipe_ingredients sri ON sub.id = sri.recipe_id
    JOIN moms_ingredients si ON sri.ingredient_id = si.id
    JOIN search_terms st ON LOWER(si.ingredient) LIKE '%' || st.term || '%'
    GROUP BY parent.id, parent.title, parent.description, parent.prep_time, parent.servings, parent.picture
),

-- Find recipes by tag
recipes_by_tag AS (
    SELECT r.id, r.title, r.description, r.prep_time, r.servings, r.picture, 3 AS priority,
           0 AS title_match_count,  -- Placeholder for title match count
           0 AS ingredient_match_count,  -- Placeholder for ingredient match count
           COUNT(st.term) AS tag_match_count  -- Count occurrences in tags
    FROM moms_recipes r
    JOIN recipe_tags rt ON r.id = rt.recipe_id
    JOIN moms_tags t ON rt.tags_id = t.id
    JOIN search_terms st ON LOWER(t.tag) LIKE '%' || st.term || '%'
    GROUP BY r.id, r.title, r.description, r.prep_time, r.servings, r.picture
)

-- Combine results and ensure unique entries
SELECT id, title, description, prep_time, servings, picture, 
       MIN(priority) AS priority,
       COALESCE(MAX(title_match_count), 0) AS title_match_count,
       COALESCE(MAX(ingredient_match_count), 0) AS ingredient_match_count,
       COALESCE(MAX(tag_match_count), 0) AS tag_match_count,
       (COALESCE(MAX(title_match_count), 0) + COALESCE(MAX(ingredient_match_count), 0) + COALESCE(MAX(tag_match_count), 0)) AS total_match_count
FROM (
    SELECT * FROM recipes_by_title
    UNION ALL
    SELECT * FROM recipes_by_ingredient
    UNION ALL
    SELECT * FROM recipes_by_tag
) AS combined_results
GROUP BY id, title, description, prep_time, servings, picture
ORDER BY 
    title_match_count DESC,  -- Order by title match count first
    ingredient_match_count DESC,  -- Then by ingredient match count
    tag_match_count DESC,  -- Finally by tag match count
    total_match_count DESC,  -- To resolve any ties, order by total matches
    LOWER(title)  -- Alphabetical order for similar results
LIMIT $2 OFFSET $3;`


    // counting
    const countAllRecipesQuery = `SELECT COUNT(*) AS total_count FROM "moms_recipes";`
    const countQueryText = `
   WITH 
search_terms AS (
    SELECT UNNEST($1::text[]) AS term
),

recipes_by_title AS (
    SELECT r.id
    FROM moms_recipes r
    JOIN search_terms st ON LOWER(r.title) LIKE '%' || LOWER(st.term) || '%'
    GROUP BY r.id
),

recipes_by_tag AS (
    SELECT r.id
    FROM moms_recipes r
    JOIN recipe_tags rt ON r.id = rt.recipe_id
    JOIN moms_tags t ON rt.tags_id = t.id
    JOIN search_terms st ON LOWER(t.tag) LIKE '%' || LOWER(st.term) || '%'
    GROUP BY r.id
),

recipes_by_ingredient AS (
    SELECT r.id
    FROM moms_recipes r
    JOIN recipe_ingredients ri ON r.id = ri.recipe_id
    JOIN moms_ingredients i ON ri.ingredient_id = i.id
    JOIN search_terms st ON LOWER(i.ingredient) LIKE '%' || LOWER(st.term) || '%'
    GROUP BY r.id

    UNION ALL

    SELECT parent.id
    FROM moms_recipes parent
    JOIN recipe_relationship rr ON parent.id = rr.parent_id
    JOIN moms_recipes sub ON rr.sub_id = sub.id
    JOIN recipe_ingredients sri ON sub.id = sri.recipe_id
    JOIN moms_ingredients si ON sri.ingredient_id = si.id
    JOIN search_terms st ON LOWER(si.ingredient) LIKE '%' || LOWER(st.term) || '%'
    GROUP BY parent.id
)

-- Combine all results and count unique recipes
SELECT COUNT(DISTINCT id) AS total_count
FROM (
    SELECT id FROM recipes_by_tag
    UNION
    SELECT id FROM recipes_by_ingredient
    UNION
    SELECT id FROM recipes_by_title
) AS combined_results
;`

    let queryText
    let countQuery
    let queryParams
    let countParams


    if (keywordArray[0] === 'browse') {
        // console.log('browsing...')
        queryText = browseQueryText
        countQuery = countAllRecipesQuery
        queryParams = [limit, offset]
        countParams = [] // no parameters for counting all recipes
    } else {
        queryText = filterQueryText
        countQuery = countQueryText
        queryParams = [keywordArray, limit, offset]
        countParams = [keywordArray] // passs only keyword array to count
    }

    pool.query(countQuery, countParams)
        .then(countResult => {
            const totalRecipes = countResult.rows[0].total_count
            const totalPages = Math.ceil(totalRecipes / limit)

            // fetch paginated recipes
            pool.query(queryText, queryParams)
                .then(result => {
                    res.send({
                        recipes: result.rows,
                        totalPages: totalPages,
                        totalRecipes: totalRecipes
                    })
                }).catch((error) => {
                    // console.log('/api/recipes/all ERROR', error)
                    res.sendStatus(500)
                })
        }).catch((error) => {
            // console.log('/api/recipes/all COUNT ERROR', error)
            res.sendStatus(500)
        })

})
// recipe details route
router.get('/details/:id', async (req, res) => {
    console.log('inside the router for', req.params.id)

    const recipeId = req.params.id

    const mainRecipe = {
        recipeDetails: null,
        ingredients: null,
        tags: null,
        steps: null
    }
    const subRecipes = []

    const parentRecipeText = `SELECT mr.id, mr.title FROM "recipe_relationship" AS rr
JOIN "moms_recipes" AS mr ON rr.parent_id = mr.id
WHERE rr.sub_id = $1;`

    const queryTextDetails = `
WITH RECURSIVE recipe_hierarchy AS (
  -- Get the main recipe and its details for 'Very Berry Waffles'
  SELECT r.id, r.title, r.is_sub_recipe, r.description, r.prep_time, r.servings, r.picture, r.is_parent_recipe
  FROM moms_recipes r
  WHERE r.id = $1
  
  UNION
  
  -- Recursively find all sub-recipes associated with 'Very Berry Waffles'
  SELECT rr.sub_id, pr.title, pr.is_sub_recipe, pr.description, pr.prep_time, pr.servings, pr.picture, pr.is_parent_recipe
  FROM recipe_relationship rr
  JOIN moms_recipes pr ON rr.sub_id = pr.id
  JOIN recipe_hierarchy rh ON rr.parent_id = rh.id
)
-- Retrieve all columns for the main recipe and its sub-recipes
SELECT rh.id as recipe_id, rh.title, rh.is_sub_recipe, rh.description, rh.prep_time, rh.servings, rh.picture, rh.is_parent_recipe
FROM recipe_hierarchy rh
ORDER BY rh.title;
`
    const queryTextIngredients = `
    WITH RECURSIVE recipe_hierarchy AS (
  -- Get the main recipe ID and title for 'Very Berry Waffles'
  SELECT r.id, r.title
  FROM moms_recipes r
  WHERE r.id = $1
  
  UNION
  
  -- Recursively find all sub-recipes associated with 'Very Berry Waffles'
  SELECT rr.sub_id, pr.title
  FROM recipe_relationship rr
  JOIN moms_recipes pr ON rr.sub_id = pr.id
  JOIN recipe_hierarchy rh ON rr.parent_id = rh.id
)
-- Retrieve all ingredients for the main recipe and its sub-recipes
SELECT rh.id AS recipe_id, rh.title AS recipe_name, ri.id AS target_id, i.ingredient, i.id AS ingredient_id, ri.quantity, ri.measurement
FROM recipe_hierarchy rh
JOIN recipe_ingredients ri ON rh.id = ri.recipe_id
JOIN moms_ingredients i ON ri.ingredient_id = i.id
ORDER BY rh.title, i.ingredient;
`
    const queryTextTags = `
   WITH RECURSIVE recipe_hierarchy AS (
  -- Get the main recipe ID and title
  SELECT r.id, r.title
  FROM moms_recipes r
  WHERE r.id = $1
  
  UNION
  
  -- Recursively find all sub-recipes
  SELECT rr.sub_id, pr.title
  FROM recipe_relationship rr
  JOIN moms_recipes pr ON rr.sub_id = pr.id
  JOIN recipe_hierarchy rh ON rr.parent_id = rh.id
)
-- Retrieve all tags for the main recipe and its sub-recipes
SELECT rh.id AS recipe_id, rh.title AS recipe_name, t.tag, t.id AS tag_id, rt.id AS delete_id
FROM recipe_hierarchy rh
JOIN recipe_tags rt ON rh.id = rt.recipe_id
JOIN moms_tags t ON rt.tags_id = t.id
ORDER BY rh.title, t.tag;
`
    const queryTextStep = `
    WITH RECURSIVE recipe_hierarchy AS (
  -- Get the main recipe ID and title for 'Very Berry Waffles'
  SELECT r.id, r.title
  FROM moms_recipes r
  WHERE r.id = $1
  
  UNION
  
  -- Recursively find all sub-recipes associated with 'Very Berry Waffles'
  SELECT rr.sub_id, pr.title
  FROM recipe_relationship rr
  JOIN moms_recipes pr ON rr.sub_id = pr.id
  JOIN recipe_hierarchy rh ON rr.parent_id = rh.id
)
-- Retrieve all steps for the main recipe and its sub-recipes
SELECT rh.id as recipe_id, rh.title AS recipe_name, s.step_number, s.instructions, s.id AS step_id
FROM recipe_hierarchy rh
JOIN moms_steps s ON rh.id = s.recipe_id
ORDER BY rh.title, s.step_number;
`

    try {
        // todo this will need to return the id of the respected ingredient/tag/step linked
        // this is for editing purposes...?


        const detailsResult = await pool.query(queryTextDetails, [recipeId])
        // console.log('detailsResult', detailsResult.rows)
        const ingredientResult = await pool.query(queryTextIngredients, [recipeId])
        // console.log('ingredientResult', ingredientResult.rows)
        const stepResult = await pool.query(queryTextStep, [recipeId])
        // console.log('stepResult', stepResult.rows)
        const tagResult = await pool.query(queryTextTags, [recipeId]) // pulls directly from main recipe
        // console.log('tagResult', tagResult.rows)

        if (detailsResult.rows.length === 0) {
            console.log('recipe not found')
            return res.sendStatus(404)
        }

        const mainDetails = detailsResult.rows.filter((details) => details.recipe_id === Number(recipeId))[0]
        const mainSteps = stepResult.rows.filter((step) => step.recipe_id === Number(recipeId)) // recipeId comes in as a string
        const mainIngredients = ingredientResult.rows.filter((ingredient) => ingredient.recipe_id === Number(recipeId)) // recipeId comes in as a string
        const mainTags = tagResult.rows.filter((tag) => tag.recipe_id === Number(recipeId)) // recipeId comes in as a string

        mainRecipe.recipeDetails = mainDetails
        mainRecipe.tags = mainTags
        mainRecipe.steps = mainSteps
        mainRecipe.ingredients = mainIngredients

        // form the sub recipes
        const subDetails = detailsResult.rows.filter((details) => details.recipe_id !== Number(recipeId))
        const subSteps = stepResult.rows.filter((step) => step.recipe_id !== Number(recipeId)) // recipeId comes in as a string
        const subIngredients = ingredientResult.rows.filter((ingredient) => ingredient.recipe_id !== Number(recipeId)) // recipeId comes in as a string
        const subTags = tagResult.rows.filter((tags) => tags.recipe_id !== Number(recipeId)) // recipeId comes in as a string

        // get unique sub-recipe ID's
        const subRecipeIds = subDetails.map((detail) => detail.recipe_id)
        console.log('subRecipeIds', subRecipeIds)

        // build sub-recipes
        subRecipeIds.forEach((subRecipeId) => {
            const subRecipe = {
                recipeDetails: null,
                ingredients: null,
                tags: null,
                steps: null
            }
            subRecipe.recipeDetails = subDetails.filter((detail) => detail.recipe_id === subRecipeId)[0]
            subRecipe.steps = subSteps.filter((step) => step.recipe_id === subRecipeId)
            subRecipe.ingredients = subIngredients.filter((ingredient) => ingredient.recipe_id === subRecipeId);
            subRecipe.tags = subTags.filter((tags) => tags.recipe_id === subRecipeId)
            // push it to the subRecipes array
            subRecipes.push(subRecipe)
        })
        // console.log('mainRecipe', mainRecipe)
        // console.log('subRecipes', subRecipes)


        // parent recipes
        const parentResults = await pool.query(parentRecipeText, [recipeId])
        const parentRecipes = parentResults.rows
        console.log('parentRecipes', parentRecipes)

        
        res.status(200).send({ mainRecipe, subRecipes, parentRecipes })

    } catch (error) {
        console.log('router DETAILS failure', error)
        res.sendStatus(500)
    }

})






module.exports = router

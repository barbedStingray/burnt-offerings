const express = require('express')
const pool = require('../modules/pool')
const router = express.Router()

// TODO REFACTOR
// todo /all NEEDS REFACTOR
// todo /details NEEDS REFACTOR

// fetches all used ingredients
router.get('/notParents', (req, res) => {

    const queryText = `SELECT * FROM "moms_recipes" WHERE is_parent_recipe = false;`    

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

// fetches all used tags
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
    console.log('keywords', keywords)
    // console.log('limit', limit)
    // console.log('offset', offset)
    const keywordArray = keywords.trim().toLowerCase().split(' ')
    console.log('keywordArray', keywordArray)

    const allQueryText = `
        SELECT * FROM "moms_recipes"
        ORDER BY LOWER(title)
        LIMIT $1 OFFSET $2
        ;`
    const filterQueryText = `
WITH 
-- Define search terms
search_terms AS (
    SELECT UNNEST($1::text[]) AS term
),

-- Find recipes by title
recipes_by_title AS (
    SELECT r.id, r.title, r.description, r.prep_time, r.servings, r.picture, 1 AS priority,
           COUNT(st.term) AS match_count
    FROM moms_recipes r
    JOIN search_terms st ON LOWER(r.title) LIKE '%' || st.term || '%'
    GROUP BY r.id, r.title, r.description, r.prep_time, r.servings, r.picture
),

-- Find recipes by tag
recipes_by_tag AS (
    SELECT r.id, r.title, r.description, r.prep_time, r.servings, r.picture, 3 AS priority,
           COUNT(st.term) AS match_count
    FROM moms_recipes r
    JOIN recipe_tags rt ON r.id = rt.recipe_id
    JOIN moms_tags t ON rt.tags_id = t.id
    JOIN search_terms st ON LOWER(t.tag) LIKE '%' || st.term || '%'
    GROUP BY r.id, r.title, r.description, r.prep_time, r.servings, r.picture
),

-- Find recipes by ingredient (including sub-recipes)
recipes_by_ingredient AS (
    SELECT r.id, r.title, r.description, r.prep_time, r.servings, r.picture, 2 AS priority,
           COUNT(st.term) AS match_count
    FROM moms_recipes r
    JOIN recipe_ingredients ri ON r.id = ri.recipe_id
    JOIN moms_ingredients i ON ri.ingredient_id = i.id
    JOIN search_terms st ON LOWER(i.ingredient) LIKE '%' || st.term || '%'
    GROUP BY r.id, r.title, r.description, r.prep_time, r.servings, r.picture

    UNION ALL

    SELECT parent.id, parent.title, parent.description, parent.prep_time, parent.servings, parent.picture, 2 AS priority,
           COUNT(st.term) AS match_count
    FROM moms_recipes parent
    JOIN recipe_relationship rr ON parent.id = rr.parent_id
    JOIN moms_recipes sub ON rr.sub_id = sub.id
    JOIN recipe_ingredients sri ON sub.id = sri.recipe_id
    JOIN moms_ingredients si ON sri.ingredient_id = si.id
    JOIN search_terms st ON LOWER(si.ingredient) LIKE '%' || st.term || '%'
    GROUP BY parent.id, parent.title, parent.description, parent.prep_time, parent.servings, parent.picture
)

-- Combine all results and ensure unique entries
SELECT id, title, description, prep_time, servings, picture, 
       MIN(priority) AS priority,
       SUM(match_count) AS match_count
FROM (
    SELECT * FROM recipes_by_tag
    UNION ALL
    SELECT * FROM recipes_by_ingredient
    UNION ALL
    SELECT * FROM recipes_by_title

) AS combined_results
GROUP BY id, title, description, prep_time, servings, picture
ORDER BY priority, match_count DESC, LOWER(title)
LIMIT $2 OFFSET $3
;`

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


    if (keywordArray[0] === 'library') {
        console.log('LIBRARY')
        queryText = allQueryText
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
                    console.log('/api/recipes/all ERROR', error)
                    res.sendStatus(500)
                })
        }).catch((error) => {
            console.log('/api/recipes/all COUNT ERROR', error)
            res.sendStatus(500)
        })

})



// todo recipe details route
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
SELECT rh.id AS recipe_id, rh.title AS recipe_name, ri.id, i.ingredient, i.id AS ingredient_id, ri.quantity, ri.measurement
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
SELECT rh.id AS recipe_id, rh.title AS recipe_name, t.tag, t.id AS tag_id
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
        console.log('mainRecipe', mainRecipe)
        console.log('subRecipes', subRecipes)

        res.send({ mainRecipe, subRecipes })

    } catch (error) {
        console.log('router DETAILS failure', error)
        res.sendStatus(500)
    }

})


module.exports = router

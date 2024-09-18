const express = require('express')
const pool = require('../modules/pool')
const router = express.Router()


// todo NEEDS REFACTOR

// all recipes route
router.get('/all', (req, res) => {

    // const keywords = req.query.keywords
    const { keywords, limit, offset } = req.query
    console.log('keywords', keywords)
    console.log('limit', limit)
    console.log('offset', offset)
    const keywordArray = keywords.trim().split(' ')
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
    JOIN search_terms st ON LOWER(t.tags) LIKE '%' || st.term || '%'
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
    JOIN search_terms st ON LOWER(t.tags) LIKE '%' || LOWER(st.term) || '%'
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

    if (keywordArray.length > 0) {
        queryText = filterQueryText
        countQuery = countQueryText
        queryParams = [keywordArray, limit, offset]
        countParams = [keywordArray] // passs only keyword array to count
    } else {
        queryText = allQueryText
        countQuery = countAllRecipesQuery
        queryParams = [limit, offset]
        countParams = [] // no parameters for counting all recipes
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
module.exports = router





// if (req.query.keywords.length > 0) {
//     console.log('keywords present')
//     queryText = filterQueryText

//     pool.query(queryText, [keywordArray]).then((result) => {
//         console.log(`/api/recipes/all success`)
//         res.send(result.rows)
//     }).catch((error) => {
//         console.log(`/api/recipes/all ERROR`, error)
//         res.sendStatus(500)
//     })

// } else {
//     console.log('NO keywords')
//     queryText = allQueryText

//     pool.query(queryText, [limit, offset]).then((result) => {
//         console.log(`/api/recipes/all success`)
//         res.send(result.rows)
//     }).catch((error) => {
//         console.log(`/api/recipes/all ERROR`, error)
//         res.sendStatus(500)
//     })
// }

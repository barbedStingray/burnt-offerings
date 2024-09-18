const express = require('express')
const pool = require('../modules/pool')
const router = express.Router()

// all recipes route
router.get('/all', (req, res) => {

    const keywords = req.query.keywords
    console.log('keywords', keywords)
    const keywordArray = keywords.trim().split(' ')
    console.log('keywordArray', keywordArray)

    const allQueryText = `SELECT * FROM "moms_recipes";`
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
;`
    let queryText

    if (req.query.keywords.length > 0) {
        console.log('keywords present')
        queryText = filterQueryText

        pool.query(queryText, [keywordArray]).then((result) => {
            console.log(`/api/recipes/all success`)
            res.send(result.rows)
        }).catch((error) => {
            console.log(`/api/recipes/all ERROR`, error)
            res.sendStatus(500)
        })
    
    } else {
        console.log('NO keywords')
        queryText = allQueryText

        pool.query(queryText).then((result) => {
            console.log(`/api/recipes/all success`)
            res.send(result.rows)
        }).catch((error) => {
            console.log(`/api/recipes/all ERROR`, error)
            res.sendStatus(500)
        })
    
    }


})


module.exports = router
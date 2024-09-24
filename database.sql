
-- Query: Select ALL Recipes
SELECT * FROM "moms_recipes";




--------------------------- Filters for Array of Keywords ---------------------------------
WITH 
-- Define search terms
--search_terms AS (
--    SELECT UNNEST($1::text[]) AS term
--),
-- for manual testing
search_terms AS (
    SELECT UNNEST(ARRAY['pineapple', 'sugar']) AS term
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
       MIN(priority) AS priority, -- comment this out
       SUM(match_count) AS match_count
FROM (
    SELECT * FROM recipes_by_tag
    UNION ALL
    SELECT * FROM recipes_by_ingredient
    UNION ALL
    SELECT * FROM recipes_by_title

) AS combined_results
GROUP BY id, title, description, prep_time, servings, picture
ORDER BY priority, match_count DESC, LOWER(title) -- switch MIN(priority)
LIMIT 10 OFFSET 0
;







------------------------- Counts Items Returned in Search --------------------------------


--search_terms AS (
--    SELECT UNNEST($1::text[]) AS term
--),


WITH 
search_terms AS (
    SELECT UNNEST(ARRAY['pineapple', 'sugar']) AS term
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
;






----------------------------- Recursive GET: details ------------------------------------
WITH RECURSIVE recipe_hierarchy AS (
  -- Get the main recipe and its details for 'Very Berry Waffles'
  SELECT r.id, r.title, r.is_sub_recipe, r.description, r.prep_time, r.servings, r.picture, r.is_parent_recipe
  FROM moms_recipes r
  WHERE r.id = 9
  
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






----------------------------- Recursive GET: tags ------------------------------------
WITH RECURSIVE recipe_hierarchy AS (
  -- Get the main recipe ID and title
  SELECT r.id, r.title
  FROM moms_recipes r
  WHERE r.id = 9
  
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






----------------------------- Recursive GET: ingredients ------------------------------------
WITH RECURSIVE recipe_hierarchy AS (
  -- Get the main recipe ID and title for 'Very Berry Waffles'
  SELECT r.id, r.title
  FROM moms_recipes r
  WHERE r.id = 9
  
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






----------------------------- Recursive GET: steps ------------------------------------
WITH RECURSIVE recipe_hierarchy AS (
  -- Get the main recipe ID and title for 'Very Berry Waffles'
  SELECT r.id, r.title
  FROM moms_recipes r
  WHERE r.id = 9
  
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


















----------------------------- TABLES ----------------------------------



--------------- RECIPES ----------------
CREATE TABLE "moms_recipes" (
    "id" SERIAL PRIMARY KEY,
    "title" VARCHAR (40) UNIQUE NOT NULL,
    "description" VARCHAR (300),
    "prep_time" VARCHAR (10),
    "servings" INTEGER,
    "is_sub_recipe" BOOLEAN default false,
    "is_parent_recipe" BOOLEAN default false,
    "picture" VARCHAR (300)
);



DELETE FROM "moms_recipes";
DROP TABLE "moms_recipes";

INSERT INTO "moms_recipes" ("title", "description", "prep_time", "servings", "is_sub_recipe", "is_parent_recipe")
VALUES
('Crumbl Cookie', 'The best crumbly cookie ever', '30mins', 12, false , false),
('Hawaiian Chicken Skewers', 'feel like a hawaiian!', '1hr', 15, false, false),
('Plain Waffle Batter', 'This is your basic waffle batter', '10mins', 18, false, false),
('Pot Roast', 'moms best pot roast', '2hr', 8, false, false),
('Tropical Smoothie', 'taste the island life', '5mins', 2, false, false),
('Icing', 'great icing for any occasion', '10mins', 5, false, false),
('Lemon Blueberry Muffins', 'Best Muffins EVERRRR', '30mins', 16, false, false),
('Berry Syrup', 'delicious berry syrup from scratch', '20mins', 5, false, false),
('Very Berry Waffles', 'Waffles smothered in da berries', '35mins', 14, false, false),
('Grilled Pineapple', 'Warm Pineapple', '10mins', 10, false, false)
;

-- *** post new recipe
INSERT INTO "moms_recipes" ("title", "description", "prep_time", "servings", "is_parent_recipe", "picture")
VALUES
($1, $2, $3, $4, $5, $6)
RETURNING id
;

-- *** update is_sub_recipe = true
UPDATE moms_recipes
SET is_sub_recipe = true
WHERE id = 3;






--------------- INGREDIENTS ----------------
CREATE TABLE "moms_ingredients" (
	"id" SERIAL PRIMARY KEY,
	"ingredient" VARCHAR (50)
);

INSERT INTO "moms_ingredients" ("ingredient")
VALUES 
('Vanilla'), ('Chicken'), ('Flour'), ('Roast Beast'), ('Sugar'),
('Pineapple'), ('Onion'), ('Mango'), ('Yogurt'), ('Chocolate Chips'),
('Brown Sugar'), ('Egg'), ('Beef Stock'), ('Powdered Sugar'), ('Milk'),
('Blueberries'), ('Syrup'), ('Raspberries')
;
	
DELETE FROM "moms_ingredients";
DROP TABLE "moms_ingredients";






--------------- TAGS ----------------
CREATE TABLE "moms_tags" (
	"id" SERIAL PRIMARY KEY,
	"tag" VARCHAR (50)
);

ALTER TABLE "moms_tags"
RENAME "tags" TO "tag";

INSERT INTO "moms_tags" ("tag")
VALUES
('Summer'), ('Fall'), ('Winter'), ('Spring'), ('Breakfast'),
('Brunch'), ('Lunch'), ('Snack'), ('Dinner'), ('Dessert'), 
('Smoothie'), ('Cookie'), ('Skewers'), ('Waffle'), ('Syrup')
;

DELETE FROM "moms_tags";
DROP TABLE "moms_tags";






--------------- JUNCTION: STEPS ----------------
CREATE TABLE "moms_steps" (
	"id" SERIAL PRIMARY KEY,
	"recipe_id" integer REFERENCES "moms_recipes",
	"step_number" INTEGER,
	"instructions" VARCHAR (100)
);
INSERT INTO "moms_steps" ("recipe_id", "step_number", "instructions")
VALUES
(7, 1, 'make the lemon blueberry batter'),
(7, 2, 'make the icing'),
(7, 3, 'Bake for 20mins at 400 degrees'),
(9, 1, 'make the waffle batter'),
(9, 2, 'make the berry compote'),
(9, 3, 'Make the waffle in the tiny maker and top with berries'),
(3, 1, 'Combine dry ingredients'),
(3, 2, 'Mix in wet ingredients'),
(8, 1, 'mush berries together'),
(8, 2, 'put on medium heat'),
(8, 3, 'add syrup to taste'),
(8, 4, 'let simmer for 20min')
;

DROP TABLE "moms_steps";

-- steps post
INSERT INTO "moms_steps" ("recipe_id", "instructions")
VALUES
($1, $2)
;






--------------- JUNCTION: recipe_relationship ----------------
CREATE TABLE "recipe_relationship" (
	"id" SERIAL PRIMARY KEY,
	"parent_id" integer REFERENCES "moms_recipes",
	"sub_id" integer REFERENCES "moms_recipes"
);

INSERT INTO "recipe_relationship" ("parent_id", "sub_id")
VALUES 
('7', '6'), ('9', '8'), ('9', '3')
;

DROP TABLE "recipe_relationship";
-- post new sub recipe
INSERT INTO "recipe_relationship" ("parent_id", "sub_id")
VALUES ($1, $2);





--------------- JUNCTION: recipe_tags ----------------
CREATE TABLE "recipe_tags" (
	"id" SERIAL PRIMARY KEY,
	"recipe_id" integer REFERENCES "moms_recipes",
	"tags_id" integer REFERENCES "moms_tags"
);

INSERT INTO "recipe_tags" ("recipe_id", "tags_id")
VALUES 
(1, 10), (1, 12), (2, 1), (2, 7), (2, 9), (2, 13), 
(3, 5), (3, 14), (4, 3), (4, 9), (5, 1), (5, 5), (5, 8), (5, 11),
(7, 2), (7, 4), (7, 5), (7, 6), (8, 15), (9, 5), (9, 6), (9, 14)
;

DROP TABLE "recipe_tags";






--------------- JUNCTION: recipe_ingredients ----------------
CREATE TABLE "recipe_ingredients" (
	"id" SERIAL PRIMARY KEY,
	"recipe_id" integer REFERENCES "moms_recipes",
	"ingredient_id" integer REFERENCES "moms_ingredients",
	"quantity" DECIMAL(10, 2),
	"measurement" VARCHAR (20)
);

INSERT INTO "recipe_ingredients" ("recipe_id", "ingredient_id", "quantity", "measurement")
VALUES 
-- cookie
(1, 1, 2, 'Tbsp'),
(1, 3, 3, 'Cups'),
(1, 5, 2.5, 'Tsp'),
(1, 10, 0.75, 'Cups'),
(1, 11, 2, 'Tsp'),
(1, 12, 1, 'Cups'),

-- Hawaiian skewers
(2, 2, 20, 'Oz'),
(2, 5, 1, 'Tbsp'),
(2, 6, 2, 'Cups'),
(2, 7, 1, 'Whole'),

-- waffle batter
(3, 1, 1.25, 'Tbsp'),
(3, 3, 2, 'Cups'),
(3, 5, 0.5, 'Cups'),
(3, 11, 5, 'Tsp'),
(3, 12, 1.66, 'Tsp'),
(3, 15, 2, 'Cups'),

-- pot roast
(4, 4, 24, 'oz'),
(4, 7, 1, 'Tbsp'),
(4, 12, 2, 'Whole'),
(4, 13, 4, 'Cups'),

-- smoothie
(5, 6, 4, 'oz'),
(5, 8, 4, 'oz'),
(5, 9, 4, 'oz'),
(5, 15, 1, 'Cups'),

-- icing
(6, 1, 0.5, 'Tsp'),
(6, 5, 1.75, 'Tsp'),
(6, 14, 1.5, 'Cups'),
(6, 15, 2, 'Tbsp'),

-- lemon blueberry muffins
(7, 1, 2, 'Tsp'),
(7, 3, 2, 'Tbsp'),
(7, 5, 2, 'Tbsp'),
(7, 9, 2, 'Tbsp'),
(7, 12, 2, 'Tbsp'),
(7, 15, 2, 'Tbsp'),
(7, 16, 2, 'Tbsp'),


-- berry syrup
(8, 16, 1, 'Cups'),
(8, 17, 2.95, 'Cups'),
(8, 18, 1, 'Cups')

-- very berry waffles
-- combination of berry syrup and plain waffle
;


DROP TABLE "recipe_ingredients";




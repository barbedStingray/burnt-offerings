import React, { useState } from 'react'
import { useParams } from 'react-router-dom'

import useRecipeDetails from '../utilities/fetchRecipeDetails'


const DetailsRecipe = () => {

    const { recipeID } = useParams()
    console.log('recipeID', recipeID)

    const { theMainRecipe, theSubRecipes, detailsStatus } = useRecipeDetails(recipeID)
    console.log('theMainRecipe', theMainRecipe)


    
    return (
        <div>
            {detailsStatus === 'loaded' ? (
                <>
                    <h1>{theMainRecipe.recipeDetails.title}</h1>
                    <p>{theMainRecipe.recipeDetails.prep_time}{theMainRecipe.recipeDetails.servings}</p>
                    <p>{theMainRecipe.recipeDetails.description}</p>
                    <h3>Ingredients</h3>
                    {theMainRecipe.ingredients.map((ingredient) => (
                        <p key={ingredient.id}>{ingredient.ingredient}{ingredient.quantity}{ingredient.measurement}</p>
                    ))}
                    <h3>Steps</h3>
                    {theMainRecipe.steps.map((step) => (
                        <p key={step.step_id}>{step.step_number}{step.instructions}</p>
                    ))}
                    <h3>Tags</h3>
                    {theMainRecipe.tags.map((tag) => (
                        <p key={tag.tag_id}>{tag.tag}</p>
                    ))}
                </>
            ) : (
                <h3>Recipe not loaded</h3>
            )}


            <h1>SUB RECIPEs</h1>
            {detailsStatus === 'loaded' ? (
                <>
                    {theSubRecipes.map((recipe) => (
                        <div key={recipe.recipeDetails.recipe_id}>
                            <h1>{recipe.recipeDetails.title}</h1>
                            <p>{recipe.recipeDetails.prep_time}{theMainRecipe.recipeDetails.servings}</p>
                            <p>{recipe.recipeDetails.description}</p>
                            <h3>Ingredients</h3>
                            {recipe.ingredients.map((ingredient) => (
                                <p key={ingredient.id}>{ingredient.ingredient}{ingredient.quantity}{ingredient.measurement}</p>
                            ))}
                            <h3>Steps</h3>
                            {recipe.steps.map((step) => (
                                <p key={step.step_id}>{step.step_number}{step.instructions}</p>
                            ))}
                            <h3>Tags</h3>
                            {recipe.tags.map((tag) => (
                                <p key={tag.tag_id}>{tag.tag}</p>
                            ))}
                        </div>
                    ))}
                </>
            ) : (
                <h3>Sub Recipe not loaded</h3>
            )}


            <h1>STATUS</h1>
            {JSON.stringify(detailsStatus)}

        </div>
    )
}

export default DetailsRecipe

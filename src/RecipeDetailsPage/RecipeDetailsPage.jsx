import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import './RecipeDetailsPage.css'

import useRecipeDetails from '../utilities/fetchRecipeDetails'


const RecipeDetailsPage = () => {

    const { recipeID } = useParams()
    console.log('recipeID', recipeID)

    // todo return just an array of recipes with the main first...
    const { theMainRecipe, theSubRecipes, detailsStatus } = useRecipeDetails(recipeID)
    console.log('theMainRecipe', theMainRecipe)
    const [isIngredient, setIsIngredient] = useState(true)
    // todo this can then be obsolete...
    const recipeDisplay = [theMainRecipe].concat(theSubRecipes)

    const [recipeIndex, setRecipeIndex] = useState(0)

    function displayNextRecipe(recipeIndex) {
        console.log('next recipe', recipeIndex)
        setRecipeIndex(recipeIndex + 1)
    }
    function displayPreviousRecipe(recipeIndex) {
        console.log('next recipe', recipeIndex)
        setRecipeIndex(recipeIndex - 1)
    }


    return (
        <div className='recipeDetailsPage'>
            <div className='quarter-circle'></div>

            <div className='recipeDetailsContainer'>
                {detailsStatus === 'loaded' ? (
                    // LOADED
                    <>
                        <div className='detailsPhoto'></div>
                        <div className='prepServings'>
                            <p>XX 30m</p>
                            <p>Makes: {recipeDisplay[recipeIndex].recipeDetails.servings}</p>
                        </div>
                        <h1>{recipeDisplay[recipeIndex].recipeDetails.title}</h1>
                        <div className='tagDetails'>
                            {recipeDisplay[recipeIndex].tags.map((tag) => (
                                <p key={tag.tag_id}>{tag.tag} X</p>
                            ))}
                        </div>
                        <p>{recipeDisplay[recipeIndex].recipeDetails.description}</p>


                        <div className='ingredientInstructionsToggle'>
                            <div onClick={() => setIsIngredient(true)}><h3>Ingredients</h3></div>
                            <div onClick={() => setIsIngredient(false)}><h3>Instructions</h3></div>
                        </div>

                        {isIngredient ? (
                            <div className='ingredients'>
                                <h3>Ingredients</h3>
                                {recipeDisplay[recipeIndex].ingredients.map((ingredient) => (
                                    <p key={ingredient.id}>{ingredient.ingredient}{ingredient.quantity}{ingredient.measurement}</p>
                                ))}
                            </div>
                        ) : (
                            <div className='instructions'>
                                <h3>Steps</h3>
                                {recipeDisplay[recipeIndex].steps.map((step) => (
                                    <p key={step.step_id}>{step.step_number}{step.instructions}</p>
                                ))}
                            </div>
                        )}

                    </>
                ) : (
                    // RECIPEs NOT LOADED
                    <></>
                )}
            </div>

            <div className='recipeSlider'>
                <button
                    disabled={recipeIndex === 0}
                    onClick={() => displayPreviousRecipe(recipeIndex)}>Prev</button>
                <button
                    disabled={recipeIndex === recipeDisplay.length - 1}
                    onClick={() => displayNextRecipe(recipeIndex)}>Next</button>
            </div>


            <h1>STATUS</h1>
            {JSON.stringify(detailsStatus)}

        </div>
    )
}

export default RecipeDetailsPage

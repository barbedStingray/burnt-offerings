import React, { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import './RecipeDetailsPage.css'
import axios from 'axios'

import useRecipeDetails from './detailFunctions/fetchRecipeDetails'

import { FaInfo } from "react-icons/fa";
import { LuAlarmClock } from "react-icons/lu";
import { LiaCookieBiteSolid } from "react-icons/lia";
import { PiRecycle } from "react-icons/pi";
import { PiPencilThin } from "react-icons/pi";



const RecipeDetailsPage = () => {

    const { recipeID } = useParams()
    const navigate = useNavigate()

    // todo return just an array of recipes with the main first...
    const { theMainRecipe, theSubRecipes, detailsStatus } = useRecipeDetails(recipeID)
    // console.log('theMainRecipe', theMainRecipe)
    const [isIngredient, setIsIngredient] = useState(true)
    // todo this can then be obsolete...
    const recipeDisplay = [theMainRecipe].concat(theSubRecipes)

    const [recipeIndex, setRecipeIndex] = useState(0)
    const slideDistance = 67;

    function displayNextRecipe(recipeIndex) {
        setRecipeIndex(recipeIndex + 1)
    }
    function displayPreviousRecipe(recipeIndex) {
        setRecipeIndex(recipeIndex - 1)
    }

    const deleteEntireRecipe = async (id) => {
        try {
            console.log('delete entire recipe', id)
            await axios.delete(`/api/recipes/deleteEntireRecipe/${id}`)

            // show module on success.. then navigate and close module
            // navigate('/')
        } catch (error) {
            console.log('ERROR delete entire recipe', id)
            // return some form of user error.
        }
    }

    return (
        <div className='detailsPage'>
            <div className='detailsQuarter'></div>



            {/* navigation */}
            <div className='detailNavigation'>
                <div className='detailNavigationParts'>
                    <Link to={`/`} className='detailHomeButton'><LiaCookieBiteSolid /></Link>
                    <div className='detailHomeButton'><PiPencilThin /></div>
                    <div className='detailHomeButton'><PiRecycle /></div>
                </div>
                <div className='detailLogoParts'>
                    <div className='detailMomPhoto'></div>
                    <div className='detailStingrayLogo'>Logo</div>
                </div>
            </div>



            <div className='recipeDetailsContainer'>
                {detailsStatus === 'loaded' ? (
                    // LOADED
                    <>
                        <div className='detailsTopDisplay'>

                            <div className='detailsTopInfo'>

                                <div className='detailsPhoto'></div>
                                <div className='prepServings'>
                                    <p><LuAlarmClock />{recipeDisplay[recipeIndex].recipeDetails.prep_time}</p>
                                    <p><FaInfo /> {recipeDisplay[recipeIndex].recipeDetails.servings}</p>
                                </div>

                            </div>

                            <div className='detailsBottomInfo'>
                                <div className='detailsTitleDisplay'>
                                    <p>{recipeDisplay[recipeIndex].recipeDetails.title}</p>
                                </div>


                                <div className='tagDetails'>
                                    {recipeDisplay[recipeIndex].tags.map((tag) => (
                                        <p key={tag.tag_id}>{tag.tag}</p>
                                    ))}
                                </div>

                                <div className='detailsRecipeDetails'>
                                    <p>{recipeDisplay[recipeIndex].recipeDetails.description}</p>
                                </div>
                            </div>
                        </div>

                        <div className='detailsTagsAndSteps'>

                            <p>Ingredients</p>
                            <div className='displayRecipeIngredients'>
                                {recipeDisplay[recipeIndex].ingredients.map((ingredient) => (
                                    <div key={ingredient.id} className='displaySingleIngredient'>
                                        <p className='displayIngredientQuantity' >{ingredient.quantity}</p>
                                        <p className='displayIngredientMeasurement'>{ingredient.measurement}</p>
                                        <p className='displayIngredientIngredient'>{ingredient.ingredient}</p>
                                    </div>
                                ))}
                            </div>

                            <p>Instructions</p>

                            <div className='displayRecipeSteps'>
                                {recipeDisplay[recipeIndex].steps.map((step) => (
                                    <div key={step.step_id} className='displayStepItem'>
                                        <p className='displayStepNumber'>{step.step_number}</p>
                                        <p className='displayStepStep'>{step.instructions}</p>
                                    </div>
                                ))}
                            </div>

                        </div>

                        <button onClick={() => deleteEntireRecipe(recipeID)}>Delete Recipe</button>



                    </>
                ) : (
                    // RECIPEs NOT LOADED
                    <></>
                )}
            </div>

            <div className='detailsFooter'>
                <button
                    className='createSubSliderButton'
                    disabled={recipeIndex === 0}
                    onClick={() => displayPreviousRecipe(recipeIndex)}
                >
                    Pr.
                </button>

                <div className='detailRecipeSlideContainer'>
                    <div
                        className='detailRecipeSubDisplay'
                        style={{
                            transform: `translateX(-${recipeIndex * slideDistance}px)`
                        }}
                    >
                        <div className='detailRecipeSubItem'></div>
                        {recipeDisplay.map((recipe, i) => (
                            <div
                                key={i}
                                className={`detailRecipeSubItem ${i === recipeIndex ? 'featureSub' : 'subFeature'}`}

                            >
                                <p>{i === 0 ? 'Main' : `Sub${i}`}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <button
                    className='createSubSliderButton'
                    disabled={recipeIndex === recipeDisplay.length - 1}
                    onClick={() => displayNextRecipe(recipeIndex)}
                >
                    N.
                </button>
            </div>



            <h1>STATUS</h1>
            {JSON.stringify(detailsStatus)}

        </div>
    )
}

export default RecipeDetailsPage

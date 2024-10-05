import React, { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import './RecipeDetailsPage.css'
import axios from 'axios'

import useRecipeDetails from './detailFunctions/fetchRecipeDetails'

import CreateTags from '../CreateRecipePage/createForms/CreateTags'
import CreateDetails from '../CreateRecipePage/createForms/CreateDetails'
import CreateIngredients from '../CreateRecipePage/createForms/CreateIngredients'

import IngredientEdit from '../components/IngredientEdit'

import generatePhoto from '../components/generatePhoto'

import { FaInfo } from "react-icons/fa";
import { LuAlarmClock } from "react-icons/lu";
import { LiaCookieBiteSolid } from "react-icons/lia";
import { PiRecycle } from "react-icons/pi";
import { PiPencilThin } from "react-icons/pi";





const RecipeDetailsPage = () => {

    const { recipeID } = useParams()
    const navigate = useNavigate()

    const [refresh, setRefresh] = useState(true)

    // todo return just an array of recipes with the main first...
    const { theMainRecipe, theSubRecipes, detailsStatus } = useRecipeDetails(recipeID, refresh)
    console.log('theMainRecipe', theMainRecipe)
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

            // todo show module on success.. then navigate and close module
            // todo navigate('/')

        } catch (error) {
            console.log('ERROR delete entire recipe', id)
            // return some form of user error.
        }
    }







    //  ! TODO begin edit functionalities
    const [letsEdit, setLetsEdit] = useState(false)
    console.log('letsEdit', letsEdit)



    // ** edit - details modal
    const [newRecipeDetails, setNewRecipeDetails] = useState({
        newTitle: '',
        description: '',
        prep_time: '',
        servings: '',
        picture: ''
    })
    const [detailsModal, setDetailsModal] = useState(false)

    function letsEditTitleDetails() {
        console.log('editing title details')
        setNewRecipeDetails({
            newTitle: theMainRecipe.recipeDetails.title,
            description: theMainRecipe.recipeDetails.description,
            prep_time: theMainRecipe.recipeDetails.prep_time,
            servings: theMainRecipe.recipeDetails.servings,
            picture: theMainRecipe.recipeDetails.picture,
        })
        setDetailsModal(true)
    }


    // todo edit - sub recipe modal



    // todo edit ingredients modal
    const [ingredientModal, setIngredientModal] = useState(false)
    // add an ingredient
    const [ingredientPackage, setIngredientPackage] = useState([])
    // delete an ingredient
    async function deleteIndividualIngredient(id) {
        console.log('deleting individual ingredient', id)
        try {
            console.log('delete ingredient', id)
            await axios.delete(`/api/recipes/deleteRecipeIngredient/${id}`)
            setRefresh(!refresh)
        } catch (error) {
            console.log('ERROR delete ind. ingredient', error)
            // return some form of user error.
        }
    }
    // todo edit an ingredient



    // todo edit - steps modal
    // todo add a step
    // todo delete a step
    // todo edit a step
    // todo reorder steps



    // ** edit - tag modal
    const [tagPackage, setTagPackage] = useState([])
    const [tagModal, setTagModal] = useState(false)

    async function deleteIndividualTag(id) {
        try {
            await axios.delete(`/api/recipes/deleteRecipeTag/${id}`)
            setRefresh(!refresh)
        } catch (error) {
            console.log('ERROR delete ind. tag', error)
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
                    <div className='detailHomeButton' onClick={() => setLetsEdit(!letsEdit)}><PiPencilThin /></div>
                    <div className='detailHomeButton'><PiRecycle /></div>
                </div>
                <div className='detailLogoParts'>
                    <div className='detailMomPhoto'></div>
                    <div className='detailStingrayLogo'>Logo</div>
                </div>
            </div>




            {/* EDIT MODALS HERE */}
            {detailsModal && (
                <div className='createSingleForm'>
                    <CreateDetails
                        dataPackage={{ newRecipeDetails, setNewRecipeDetails }}
                        editPackage={{ detailsModal, setDetailsModal }}
                        detailsPackage={{ recipeID, refresh, setRefresh }}
                    />
                </div>
            )}

            {tagModal && (
                <div className='createSingleForm'>
                    <CreateTags
                        dataPackage={{ tagPackage, setTagPackage }}
                        editPackage={{ tagModal, setTagModal }}
                        detailsPackage={{ recipeID, refresh, setRefresh }}
                    />,
                </div>
            )}

            {ingredientModal && (
                <div className='createSingleForm'>
                    <CreateIngredients
                        dataPackage={{ ingredientPackage, setIngredientPackage }}
                        editPackage={{ ingredientModal, setIngredientModal }}
                        detailsPackage={{ recipeID, refresh, setRefresh }}
                    />,
                </div>
            )}



            <div className='recipeDetailsContainer'>
                {detailsStatus === 'loaded' ? (
                    // LOADED
                    <>
                        <div className='detailsTopDisplay'>

                            <div className='detailsTopInfo'>

                                <div className='detailsPhotoContainer'>
                                    {/* // ! this will change to accept 'no photo' */}

                                    {/* {recipe.picture?.startsWith('http') ? (
                                                <img className='mosaicPhoto' src={recipe.picture} />
                                            ) : (
                                                <p className='homeGeneratedIcon'>{generatePhoto(recipe.picture)}</p>
                                            )} */}

                                    {recipeDisplay[recipeIndex].recipeDetails.picture.startsWith('http') ? (
                                        <img className='detailsPhoto' src={recipeDisplay[recipeIndex].recipeDetails.picture} />
                                    ) : (
                                        <p className='detailGeneratedIcon'>{generatePhoto(recipeDisplay[recipeIndex].recipeDetails.picture)}</p>
                                    )}
                                </div>

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
                                    {recipeDisplay[recipeIndex].tags.map((tag, i) => (
                                        <p
                                            key={i}
                                            onClick={letsEdit ? (() => deleteIndividualTag(tag.delete_id)) : null}
                                        >
                                            {tag.tag}{letsEdit && ' X'}
                                        </p>
                                    ))}
                                </div>



                                {letsEdit && (
                                    <>
                                        <button onClick={() => letsEditTitleDetails()}>Edit Details</button>
                                        <button onClick={() => setIngredientModal(!ingredientModal)}>Add Ingredient</button>
                                        <button onClick={() => setTagModal(!tagModal)}>Add Tag</button>
                                    </>
                                )}

                            </div>
                        </div>

                        <div className='detailsDescriptionParts'>
                            <p className='detailsDescriptionTitle'>Description</p>
                            <p className='detailsDescription'>{recipeDisplay[recipeIndex].recipeDetails.description}</p>
                        </div>

                        <div className='detailsTagsAndSteps'>

                            <p className='detailsDescriptionTitle'>Ingredients</p>

                            <div className='displayRecipeIngredients'>
                                {recipeDisplay[recipeIndex].ingredients.map((ingredient, i) => (
                                    <div
                                        key={i}
                                        className='displaySingleIngredient'
                                    >
                                        {/* {letsEdit && <button onClick={() => letsEditIngredient(ingredient.target_id, ingredient.ingredient, ingredient.quantity, ingredient.measurement)}>EDIT ME</button>} */}
                                        {letsEdit && <button onClick={letsEdit ? () => deleteIndividualIngredient(ingredient.target_id) : null}>DELETE ME</button>}


                                        <p className='displayIngredientQuantity' >{ingredient.quantity}</p>
                                        <p className='displayIngredientMeasurement'>{ingredient.measurement}</p>
                                        <IngredientEdit ingredient={ingredient.ingredient} target_id={ingredient.target_id} letsEdit={letsEdit} />
                                        {/* <p className='displayIngredientIngredient'>{ingredient.ingredient}</p> */}
                                        {letsEdit ? <p className='displayIngredientIngredient'>{ingredient.target_id}</p> : null}
                                    </div>
                                ))}
                            </div>

                            <p className='detailsDescriptionTitle'>Instructions</p>

                            <div className='displayRecipeSteps'>
                                {recipeDisplay[recipeIndex].steps.map((step, i) => (
                                    <div key={i} className='displayStepItem'>
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


            {recipeDisplay > 1 && (
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
            )}



            {/* {JSON.stringify(detailsStatus)} */}

        </div>
    )
}

export default RecipeDetailsPage

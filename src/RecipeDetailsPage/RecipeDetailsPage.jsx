import React, { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import './RecipeDetailsPage.css'
import axios from 'axios'

import useRecipeDetails from './detailFunctions/fetchRecipeDetails'

import CreateTags from '../CreateRecipePage/createForms/CreateTags'
import CreateIngredients from '../CreateRecipePage/createForms/CreateIngredients'
import CreateSteps from '../CreateRecipePage/createForms/CreateSteps'
import CreateSubRecipes from '../CreateRecipePage/createForms/CreateSubRecipes'

import EditTheDetail from '../components/EditTheDetail'
import deleteSoloDetail from '../components/deleteSoloDetail'

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
    // console.log('theMainRecipe', theMainRecipe)
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
            alert('sorry, your recipe was not deleted')
        }
    }





    //  ! TODO begin edit functionalities
    const [letsEdit, setLetsEdit] = useState(false)
    console.log('letsEdit', letsEdit)
    const [editView, setEditView] = useState('')
    console.log('editView', editView)

    function generateEditModalType(editModalType) {
        switch (editModalType) {
            case 'subRecipe':
                return (
                    <div className='createSingleForm'>
                        <CreateSubRecipes
                            dataPackage={{ recipeID, subRecipePackage, setSubRecipePackage }}
                            editPackage={{ editView, setEditView, refresh, setRefresh }}
                        />
                    </div>
                )
            case 'ingredient':
                return (
                    <div className='createSingleForm'>
                        <CreateIngredients
                            dataPackage={{ recipeID, ingredientPackage, setIngredientPackage }}
                            editPackage={{ editView, setEditView, refresh, setRefresh }}
                        />
                    </div>
                )
            case 'tag':
                return (
                    <div className='createSingleForm'>
                        <CreateTags
                            dataPackage={{ recipeID, tagPackage, setTagPackage }}
                            editPackage={{ editView, setEditView, refresh, setRefresh }}
                        />
                    </div>
                )
            case 'step':
                return (
                    <div className='createSingleForm'>
                        <CreateSteps
                            dataPackage={{ recipeID, stepPackage, setStepPackage }}
                            editPackage={{ editView, setEditView, refresh, setRefresh }}
                        />
                    </div>
                )
            default:
                return null
        }
    }




    // todo edit - sub recipe modal
    const [subRecipePackage, setSubRecipePackage] = useState([])
    // add an ingredient
    const [ingredientPackage, setIngredientPackage] = useState([])
    // edit steps modal
    const [stepPackage, setStepPackage] = useState([])
    // ** edit - tag modal
    const [tagPackage, setTagPackage] = useState([])






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




            {editView.length > 0 && (
                <>
                    {generateEditModalType(editView)}
                </>
            )}




            <div className='recipeDetailsContainer'>
                {detailsStatus === 'loaded' ? (
                    // LOADED
                    <>
                        <div className='detailsTopDisplay'>

                            <div className='detailsTopInfo'>

                                <div className='detailsPhotoContainer'>
                                    {recipeDisplay[recipeIndex].recipeDetails.picture.startsWith('http') ? (
                                        <img className='detailsPhoto' src={recipeDisplay[recipeIndex].recipeDetails.picture} />
                                    ) : (
                                        <p className='detailGeneratedIcon'>{generatePhoto(recipeDisplay[recipeIndex].recipeDetails.picture)}</p>
                                    )}
                                </div>

                                <div className='prepServings'>
                                    <p><LuAlarmClock /></p>
                                    <EditTheDetail category={'prep_time'} detail={recipeDisplay[0].recipeDetails.prep_time} target_id={recipeID} letsEdit={letsEdit} refresh={refresh} setRefresh={setRefresh} />
                                    <p><FaInfo /> {recipeDisplay[recipeIndex].recipeDetails.servings}</p>
                                    <EditTheDetail category={'servings'} detail={recipeDisplay[0].recipeDetails.servings} target_id={recipeID} letsEdit={letsEdit} refresh={refresh} setRefresh={setRefresh} />
                                </div>

                            </div>

                            <div className='detailsBottomInfo'>
                                <div className='detailsTitleDisplay'>
                                    <EditTheDetail category={'title'} detail={recipeDisplay[0].recipeDetails.title} target_id={recipeID} letsEdit={letsEdit} refresh={refresh} setRefresh={setRefresh} />
                                </div>


                                <div className='tagDetails'>
                                    {recipeDisplay[recipeIndex].tags.map((tag, i) => (
                                        <p
                                            key={i}
                                            onClick={letsEdit ? (() => deleteSoloDetail('tag', tag.delete_id, refresh, setRefresh)) : null}
                                        >
                                            {tag.tag}{letsEdit && ' X'}
                                        </p>
                                    ))}
                                </div>



                                {letsEdit && (
                                    <>
                                        <button onClick={() => setEditView('ingredient')}>View Ingredient</button>
                                        <button onClick={() => setEditView('tag')}>View Tag</button>
                                        <button onClick={() => setEditView('step')}>View Step</button>
                                    </>
                                )}

                            </div>
                        </div>

                        <div className='detailsDescriptionParts'>
                            <p className='detailsDescriptionTitle'>Description</p>
                            <EditTheDetail category={'description'} detail={recipeDisplay[0].recipeDetails.description} target_id={recipeID} letsEdit={letsEdit} refresh={refresh} setRefresh={setRefresh} />
                        </div>

                        <div className='detailsTagsAndSteps'>

                            <p className='detailsDescriptionTitle'>Ingredients</p>

                            <div className='displayRecipeIngredients'>
                                {recipeDisplay[recipeIndex].ingredients.map((ingredient, i) => (
                                    <div
                                        key={i}
                                        className='displaySingleIngredient'
                                    >
                                        {letsEdit && <button onClick={letsEdit ? () => deleteSoloDetail('ingredient', ingredient.target_id, refresh, setRefresh) : null}>DELETE ME</button>}
                                        <EditTheDetail category={'quantity'} detail={ingredient.quantity} target_id={ingredient.target_id} letsEdit={letsEdit} refresh={refresh} setRefresh={setRefresh} />
                                        <EditTheDetail category={'measurement'} detail={ingredient.measurement} target_id={ingredient.target_id} letsEdit={letsEdit} refresh={refresh} setRefresh={setRefresh} />
                                        <EditTheDetail category={'ingredient'} detail={ingredient.ingredient} target_id={ingredient.target_id} letsEdit={letsEdit} refresh={refresh} setRefresh={setRefresh} />
                                    </div>
                                ))}
                            </div>

                            <p className='detailsDescriptionTitle'>Instructions</p>

                            <div className='displayRecipeSteps'>
                                {recipeDisplay[recipeIndex].steps.map((step, i) => (
                                    <div key={i} className='displayStepItem'>
                                        {letsEdit && <button onClick={() => deleteSoloDetail('step', step.step_id, refresh, setRefresh)}>DELETE ME</button>}
                                        <EditTheDetail category={'step_number'} detail={step.step_number} target_id={step.step_id} letsEdit={letsEdit} refresh={refresh} setRefresh={setRefresh} />
                                        <EditTheDetail category={'instructions'} detail={step.instructions} target_id={step.step_id} letsEdit={letsEdit} refresh={refresh} setRefresh={setRefresh} />
                                        {/* <p className='displayStepNumber'>{step.step_number}</p>
                                        <p className='displayStepStep'>{step.instructions}</p> */}
                                    </div>
                                ))}
                            </div>

                        </div>

                        {recipeIndex > 0 ? (
                            <button>Remove Sub Recipe</button>
                        ) : (
                            <>
                                <button onClick={() => setEditView('subRecipe')}>Add SubRecipes</button>
                                <button onClick={() => deleteEntireRecipe(recipeID)}>Delete Recipe</button>
                            </>
                        )}



                    </>
                ) : (
                    // RECIPEs NOT LOADED
                    <></>
                )}
            </div>


            {/* // ! greater than 0 ?? */}
            {recipeDisplay.length > 1 && (
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



            {/* // todo {JSON.stringify(detailsStatus)} */}

        </div>
    )
}

export default RecipeDetailsPage

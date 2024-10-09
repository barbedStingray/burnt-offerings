import React, { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import './RecipeDetailsPage.css'
import axios from 'axios'

import useRecipeDetails from './detailFunctions/fetchRecipeDetails'

import CreateTags from '../CreateRecipePage/createForms/CreateTags'
import CreateIngredients from '../CreateRecipePage/createForms/CreateIngredients'
import CreateSteps from '../CreateRecipePage/createForms/CreateSteps'
import CreateSubRecipes from '../CreateRecipePage/createForms/CreateSubRecipes'
import ImageUpload from '../components/ImageUpload'

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
    const [refresh, setRefresh] = useState(true)
    const { theMainRecipe, theSubRecipes, theParentRecipes, detailsStatus } = useRecipeDetails(recipeID, refresh)
    const recipeDisplay = [theMainRecipe].concat(theSubRecipes)
    const [recipeIndex, setRecipeIndex] = useState(0)
    const slideDistance = 67;
    const displayId = detailsStatus === 'loaded' ? recipeDisplay[recipeIndex].recipeDetails.recipe_id : recipeID


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
    const [editView, setEditView] = useState('')
    const [letsConvert, setLetsConvert] = useState(false)
    const [multiplier, setMultiplier] = useState(1)
    

    function generateEditModalType(editModalType) {
        switch (editModalType) {
            case 'subRecipe':
                return (
                    <div className='createSingleForm'>
                        <CreateSubRecipes
                            dataPackage={{ displayId, subRecipePackage, setSubRecipePackage }}
                            editPackage={{ editView, setEditView, refresh, setRefresh }}
                        />
                    </div>
                )
            case 'ingredient':
                return (
                    <div className='createSingleForm'>
                        <CreateIngredients
                            dataPackage={{ displayId, ingredientPackage, setIngredientPackage }}
                            editPackage={{ editView, setEditView, refresh, setRefresh }}
                        />
                    </div>
                )
            case 'tag':
                return (
                    <div className='createSingleForm'>
                        <CreateTags
                            dataPackage={{ displayId, tagPackage, setTagPackage }}
                            editPackage={{ editView, setEditView, refresh, setRefresh }}
                        />
                    </div>
                )
            case 'step':
                return (
                    <div className='createSingleForm'>
                        <CreateSteps
                            dataPackage={{ displayId, stepPackage, setStepPackage }}
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
    const [ingredientPackage, setIngredientPackage] = useState([])
    const [stepPackage, setStepPackage] = useState([])
    const [tagPackage, setTagPackage] = useState([])


    const addCustomPhoto = async (properties) => {
        console.log('adding new photo properties:', properties)
        // todo post to the router
        try {
            await axios.put(`/api/recipes/putNewPhoto/${displayId}`, { data: { properties } })
            setRefresh(!refresh)

        } catch (error) {
            console.log('error in changing photo', error)
            alert('Sorry, your photo didnt make it!')
        }
    }



    return (
        <div className='detailsPage'>
            <div className='detailsQuarter'></div>


            {/* navigation */}
            <div className='detailNavigation'>
                <div className='detailNavigationParts'>
                    <Link to={`/`} className='detailHomeButton'><LiaCookieBiteSolid /></Link>
                    <div className={`detailHomeButton ${letsEdit && 'activeMode'}`} onClick={() => setLetsEdit(!letsEdit)}><PiPencilThin /></div>
                    <div className={`detailHomeButton ${letsConvert && 'activeMode'}`} onClick={() => setLetsConvert(!letsConvert)}><PiRecycle /></div>
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

                                    {letsEdit ? (
                                        <ImageUpload photoFunction={addCustomPhoto} recipeImage={recipeDisplay[recipeIndex].recipeDetails.picture} />
                                    ) : (
                                        <>
                                            {
                                                recipeDisplay[recipeIndex].recipeDetails.picture.startsWith('http') ? (
                                                    <img className='detailsPhoto' src={recipeDisplay[recipeIndex].recipeDetails.picture} />
                                                ) : (
                                                    <p className='detailGeneratedIcon'>{generatePhoto(recipeDisplay[recipeIndex].recipeDetails.picture)}</p>
                                                )
                                            }
                                        </>
                                    )}




                                </div>

                                <div className='prepServings'>
                                    <p><LuAlarmClock /></p>

                                    <EditTheDetail
                                        category={{ type: 'prep_time', detail: recipeDisplay[recipeIndex].recipeDetails.prep_time, target_id: displayId }}
                                        editPackage={{ letsEdit, refresh, setRefresh, letsConvert }}
                                    />

                                    {/* <EditTheDetail category={'prep_time'} detail={recipeDisplay[recipeIndex].recipeDetails.prep_time} target_id={displayId} letsEdit={letsEdit} refresh={refresh} setRefresh={setRefresh} /> */}
                                    <p><FaInfo /></p>


                                    <EditTheDetail
                                        category={{ type: 'servings', detail: recipeDisplay[recipeIndex].recipeDetails.servings, target_id: displayId }}
                                        editPackage={{ letsEdit, refresh, setRefresh, letsConvert }}
                                    />

                                    {/* <EditTheDetail category={'servings'} detail={recipeDisplay[recipeIndex].recipeDetails.servings} target_id={displayId} letsEdit={letsEdit} refresh={refresh} setRefresh={setRefresh} /> */}
                                </div>

                            </div>

                            <div className='detailsBottomInfo'>
                                <div className='detailsTitleDisplay'>
                                    <EditTheDetail
                                        category={{ type: 'title', detail: recipeDisplay[recipeIndex].recipeDetails.title, target_id: displayId }}
                                        editPackage={{ letsEdit, refresh, setRefresh, letsConvert }}
                                    />

                                    {/* <EditTheDetail category={'title'} detail={recipeDisplay[recipeIndex].recipeDetails.title} target_id={displayId} letsEdit={letsEdit} refresh={refresh} setRefresh={setRefresh} /> */}
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
                            <EditTheDetail
                                category={{ type: 'description', detail: recipeDisplay[recipeIndex].recipeDetails.description, target_id: displayId }}
                                editPackage={{ letsEdit, refresh, setRefresh, letsConvert }}
                            />

                            {/* <EditTheDetail category={'description'} detail={recipeDisplay[recipeIndex].recipeDetails.description} target_id={displayId} letsEdit={letsEdit} refresh={refresh} setRefresh={setRefresh} /> */}

                        </div>
                        <div>
                            <p>Multiply Your Recipe</p>
                            <div onClick={() => setMultiplier(0.5)}>0.5x</div>
                            <div onClick={() => setMultiplier(1)}>1x</div>
                            <div onClick={() => setMultiplier(2)}>2x</div>
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

                                        <EditTheDetail
                                            category={{ type: 'quantity', detail: ingredient.quantity, target_id: ingredient.target_id }}
                                            editPackage={{ letsEdit, refresh, setRefresh, letsConvert, multiplier }}
                                        />
                                        <EditTheDetail
                                            category={{ type: 'measurement', detail: ingredient.measurement, target_id: ingredient.target_id }}
                                            editPackage={{ letsEdit, refresh, setRefresh, letsConvert }}
                                        />
                                        <EditTheDetail
                                            category={{ type: 'ingredient', detail: ingredient.ingredient, target_id: ingredient.target_id }}
                                            editPackage={{ letsEdit, refresh, setRefresh, letsConvert }}
                                        />

                                        {/* THIS IS BEFORE THE RECKONING BIG CHANGES>...... */}
                                        {/* <EditTheDetail category={'quantity'} detail={ingredient.quantity} target_id={ingredient.target_id} letsEdit={letsEdit} refresh={refresh} setRefresh={setRefresh} />
                                        <EditTheDetail category={'measurement'} detail={ingredient.measurement} target_id={ingredient.target_id} letsEdit={letsEdit} refresh={refresh} setRefresh={setRefresh} />
                                        <EditTheDetail category={'ingredient'} detail={ingredient.ingredient} target_id={ingredient.target_id} letsEdit={letsEdit} refresh={refresh} setRefresh={setRefresh} /> */}
                                    </div>
                                ))}
                            </div>

                            <p className='detailsDescriptionTitle'>Instructions</p>

                            <div className='displayRecipeSteps'>
                                {recipeDisplay[recipeIndex].steps.map((step, i) => (
                                    <div key={i} className='displayStepItem'>
                                        {letsEdit && <button onClick={() => deleteSoloDetail('step', step.step_id, refresh, setRefresh)}>DELETE ME</button>}

                                        <EditTheDetail
                                            category={{ type: 'step_number', detail: step.step_number, target_id: step.step_id }}
                                            editPackage={{ letsEdit, refresh, setRefresh, letsConvert }}
                                        />
                                        <EditTheDetail
                                            category={{ type: 'instructions', detail: step.instructions, target_id: step.step_id }}
                                            editPackage={{ letsEdit, refresh, setRefresh, letsConvert }}
                                        />


                                        {/* <EditTheDetail category={'step_number'} detail={step.step_number} target_id={step.step_id} letsEdit={letsEdit} refresh={refresh} setRefresh={setRefresh} /> */}
                                        {/* <EditTheDetail category={'instructions'} detail={step.instructions} target_id={step.step_id} letsEdit={letsEdit} refresh={refresh} setRefresh={setRefresh} /> */}
                                        {/* <p className='displayStepNumber'>{step.step_number}</p>
                                        <p className='displayStepStep'>{step.instructions}</p> */}
                                    </div>
                                ))}
                            </div>

                        </div>



                        {/* // ! only way you can get duplicates is if there's a duplicate on the from */}

                        <div>
                            {recipeIndex > 0 ? (
                                <button onClick={() => deleteSoloDetail('subRecipe', displayId, refresh, setRefresh, recipeID, setRecipeIndex)}>Remove Sub Recipe</button>
                            ) : (
                                <>
                                    <h5>Sub Recipe Management</h5>
                                    {recipeDisplay[recipeIndex].recipeDetails.is_sub_recipe ? (
                                        <>
                                            <p>No sub recipes on an existing sub recipe</p>
                                        </>
                                    ) : (
                                        <button onClick={() => setEditView('subRecipe')}>Sub Recipe Allowed</button>
                                    )}
                                </>
                            )}
                        </div>

                        <p>Parents:</p>
                        {theParentRecipes.map((parent, i) => (
                            <p key={i}>{parent.title}{parent.id}</p>
                        ))}



                        <button onClick={() => deleteEntireRecipe(displayId)}>Delete This Recipe</button>


                    </>
                ) : (

                    // todo RECIPEs NOT LOADED
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

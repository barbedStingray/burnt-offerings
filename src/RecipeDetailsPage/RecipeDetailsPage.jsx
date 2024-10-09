import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import './RecipeDetailsPage.css'

import useRecipeDetails from './detailFunctions/fetchRecipeDetails'
import CreateTags from '../CreateRecipePage/createForms/CreateTags'
import CreateIngredients from '../CreateRecipePage/createForms/CreateIngredients'
import CreateSteps from '../CreateRecipePage/createForms/CreateSteps'
import CreateSubRecipes from '../CreateRecipePage/createForms/CreateSubRecipes'
import EditTheDetail from '../components/EditTheDetail'
import deleteSoloDetail from '../components/deleteSoloDetail'
import DisplayPhoto from './detailComponents/DisplayPhoto'
import DisplayIngredients from './detailComponents/DisplayIngredients'
import DisplayDescription from './detailComponents/DisplayDescription'
import DisplaySteps from './detailComponents/DisplaySteps'
import DisplayTags from './detailComponents/DisplayTags'
import DisplayErrorDetail from './detailComponents/DisplayErrorDetail'


import deleteEntireRecipe from './detailFunctions/deleteEntireRecipe'
import DeleteModal from './detailComponents/DeleteModal'
import DisplayMultiplier from './detailComponents/DisplayMultiplier'
import DetailNav from './detailComponents/DetailNav'
import { FaInfo } from "react-icons/fa";
import { LuAlarmClock } from "react-icons/lu";



const RecipeDetailsPage = () => {

    const { recipeID } = useParams()
    const [refresh, setRefresh] = useState(true)
    const { theMainRecipe, theSubRecipes, theParentRecipes, isLoaded, detailStatus } = useRecipeDetails(recipeID, refresh)
    const recipeDisplay = [theMainRecipe].concat(theSubRecipes)
    console.log('recipeDisplay', recipeDisplay)
    const [recipeIndex, setRecipeIndex] = useState(0)
    const slideDistance = 67;
    const displayId = isLoaded ? recipeDisplay[recipeIndex].recipeDetails.recipe_id : recipeID
    const [deleteModal, setDeleteModal] = useState(false)
    const [deleteStatus, setDeleteStatus] = useState('resting')

    // edit properties
    const [letsEdit, setLetsEdit] = useState(false)
    const [editView, setEditView] = useState('')
    const [multiplier, setMultiplier] = useState(1)
    const [subRecipePackage, setSubRecipePackage] = useState([])
    const [ingredientPackage, setIngredientPackage] = useState([])
    const [stepPackage, setStepPackage] = useState([])
    const [tagPackage, setTagPackage] = useState([])


    function displayNextRecipe(recipeIndex) {
        setRecipeIndex(recipeIndex + 1)
    }
    function displayPreviousRecipe(recipeIndex) {
        setRecipeIndex(recipeIndex - 1)
    }


    function generateAddModalType(addModalType) {
        switch (addModalType) {
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


    return (
        <div className='detailsPage'>
            <div className='detailsQuarter'></div>

            <DetailNav editPackage={{ letsEdit, setLetsEdit }} />

            <DeleteModal editPackage={{ deleteModal, setDeleteModal, deleteStatus }} />


            {/* This is generating your add forms */}
            {editView.length > 0 && (
                <>
                    {generateAddModalType(editView)}
                </>
            )}

            <div className='recipeDetailsContainer'>
                {isLoaded ? (
                    <>

                        {/* {recipeDisplay.map((recipe) => (
                            <>
                                <p>{recipe.recipeDetails.title}</p>
                                <DisplayPhoto
                                    editPackage={{ letsEdit, refresh, setRefresh }}
                                    detailPackage={{ displayId, picture: recipeDisplay[recipeIndex].recipeDetails.picture }}
                                />
                            </>
                        ))}
 */}
                        <div className='detailsTopDisplay'>

                            <div className='detailsTopInfo'>

                                <DisplayPhoto
                                    editPackage={{ letsEdit, refresh, setRefresh }}
                                    detailPackage={{ displayId, picture: recipeDisplay[recipeIndex].recipeDetails.picture }}
                                />

                                {/* // ? What do you want these to look like? */}
                                <div className='prepServings'>
                                    <div>
                                        <LuAlarmClock />
                                        <EditTheDetail
                                            category={{ type: 'prep_time', detail: recipeDisplay[recipeIndex].recipeDetails.prep_time, target_id: displayId }}
                                            editPackage={{ letsEdit, refresh, setRefresh }}
                                        />
                                    </div>
                                    <div>
                                        <p><FaInfo /></p>
                                        <EditTheDetail
                                            category={{ type: 'servings', detail: recipeDisplay[recipeIndex].recipeDetails.servings, target_id: displayId }}
                                            editPackage={{ letsEdit, refresh, setRefresh }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className='detailsBottomInfo'>

                                <div className='detailsTitleDisplay'>
                                    <EditTheDetail
                                        category={{ type: 'title', detail: recipeDisplay[recipeIndex].recipeDetails.title, target_id: displayId }}
                                        editPackage={{ letsEdit, refresh, setRefresh }}
                                    />
                                </div>

                                <DisplayTags
                                    editPackage={{ letsEdit, refresh, setRefresh }}
                                    detailPackage={{ tags: recipeDisplay[recipeIndex].tags, setEditView }}
                                />
                            </div>
                        </div>

                        <DisplayDescription
                            editPackage={{ letsEdit, refresh, setRefresh }}
                            detailPackage={{ displayId, description: recipeDisplay[recipeIndex].recipeDetails.description }}
                        />

                        <DisplayMultiplier setMultiplier={setMultiplier} />

                        <div className='detailsTagsAndSteps'>
                            <DisplayIngredients
                                editPackage={{ letsEdit, refresh, setRefresh, multiplier }}
                                detailPackage={{ ingredients: recipeDisplay[recipeIndex].ingredients, setEditView }}
                            />
                            <DisplaySteps
                                editPackage={{ letsEdit, refresh, setRefresh }}
                                detailPackage={{ instructions: recipeDisplay[recipeIndex].steps, recipeIndex, setEditView }}
                            />
                        </div>


                        <div>
                            {/* // ! only way you can get duplicates is if there's a duplicate on the from */}
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


                        <button onClick={() => deleteEntireRecipe(displayId, setDeleteModal, setDeleteStatus)}>Delete This Recipe</button>
                    </>
                ) : (
                    <DisplayErrorDetail detailStatus={detailStatus} />
                )}
            </div>


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

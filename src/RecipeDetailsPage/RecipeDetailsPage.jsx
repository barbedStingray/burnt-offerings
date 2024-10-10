import React, { useState, useEffect, useRef } from 'react'
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
import useScrollTracking from '../CreateRecipePage/createFunctions/scrollFunctions/useScrollTracking'


import deleteEntireRecipe from './detailFunctions/deleteEntireRecipe'
import DeleteModal from './detailComponents/DeleteModal'
import DisplayMultiplier from './detailComponents/DisplayMultiplier'
import DetailNav from './detailComponents/DetailNav'
import { FaInfo } from "react-icons/fa";
import { LuAlarmClock } from "react-icons/lu";


const RecipeDetailsPage = () => {

    const { recipeID } = useParams()
    const detailScrollRef = useRef(null)
    const [refresh, setRefresh] = useState(true)

    const { theMainRecipe, theSubRecipes, theParentRecipes, isLoaded, detailStatus } = useRecipeDetails(recipeID, refresh)
    const recipeDisplay = [theMainRecipe].concat(theSubRecipes)
    const scrollIndex = useScrollTracking(detailScrollRef, isLoaded)
    const [displayId, setDisplayId] = useState(recipeID)
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

    // updates your 
    useEffect(() => {
        if (isLoaded) {
            setDisplayId(recipeDisplay[scrollIndex].recipeDetails.recipe_id)
        }
    }, [scrollIndex, isLoaded])


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

            <DetailNav editPackage={{ letsEdit, setLetsEdit }} />

            <DeleteModal editPackage={{ deleteModal, setDeleteModal, deleteStatus }} />
            {/* This is generating your add forms */}
            {editView.length > 0 && (
                <>
                    {generateAddModalType(editView)}
                </>
            )}


            {isLoaded ? (
                <div className='detailSliderContainer' ref={detailScrollRef}>
                    {recipeDisplay.map((recipe, i) => (
                        <div key={i} className='recipeDetailsScrollContainer'>
                            <div className='recipeDetailContainer'>
                                <div className='detailsTopDisplay'>

                                    <div className='detailsTopInfo'>

                                        <DisplayPhoto
                                            editPackage={{ letsEdit, refresh, setRefresh }}
                                            detailPackage={{ displayId, picture: recipe.recipeDetails.picture }}
                                        />

                                        <div className='prepServings'>
                                            <div>
                                                <LuAlarmClock />
                                                <EditTheDetail
                                                    category={{ type: 'prep_time', detail: recipe.recipeDetails.prep_time, target_id: displayId }}
                                                    editPackage={{ letsEdit, refresh, setRefresh }}
                                                />
                                            </div>
                                            <div>
                                                <p><FaInfo /></p>
                                                <EditTheDetail
                                                    category={{ type: 'servings', detail: recipe.recipeDetails.servings, target_id: displayId }}
                                                    editPackage={{ letsEdit, refresh, setRefresh }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className='detailsBottomInfo'>

                                        <div className='detailsTitleDisplay'>
                                            <EditTheDetail
                                                category={{ type: 'title', detail: recipe.recipeDetails.title, target_id: displayId }}
                                                editPackage={{ letsEdit, refresh, setRefresh }}
                                            />
                                        </div>

                                        <DisplayTags
                                            editPackage={{ letsEdit, refresh, setRefresh }}
                                            detailPackage={{ tags: recipe.tags, setEditView }}
                                        />
                                    </div>
                                </div>

                                <DisplayDescription
                                    editPackage={{ letsEdit, refresh, setRefresh }}
                                    detailPackage={{ displayId, description: recipe.recipeDetails.description }}
                                />

                                <DisplayMultiplier setMultiplier={setMultiplier} />

                                <div className='detailsTagsAndSteps'>
                                    <DisplayIngredients
                                        editPackage={{ letsEdit, refresh, setRefresh, multiplier }}
                                        detailPackage={{ ingredients: recipe.ingredients, setEditView }}
                                    />
                                    <DisplaySteps
                                        editPackage={{ letsEdit, refresh, setRefresh }}
                                        detailPackage={{ instructions: recipe.steps, setEditView }}
                                    />
                                </div>


                                <div>
                                    {/* // ! only way you can get duplicates is if there's a duplicate on the from */}
                                    {scrollIndex > 0 ? (
                                        <button onClick={() => deleteSoloDetail('subRecipe', displayId, refresh, setRefresh, recipeID)}>Remove Sub Recipe</button>
                                    ) : (
                                        <>
                                            <h5>Sub Recipe Management</h5>
                                            {recipe.recipeDetails.is_sub_recipe ? (
                                                <>
                                                    <p>No sub recipes on an existing sub recipe</p>
                                                </>
                                            ) : (
                                                <button onClick={() => setEditView('subRecipe')}>Sub Recipe Allowed</button>
                                            )}
                                        </>
                                    )}
                                </div>


                                {scrollIndex === 0 && (
                                    <>
                                        <p>Parents:</p>
                                        {theParentRecipes.map((parent, i) => (
                                            <p key={i}>{parent.title}{parent.id}</p>
                                        ))}
                                    </>
                                )}

                                <button onClick={() => deleteEntireRecipe(displayId, setDeleteModal, setDeleteStatus)}>Delete This Recipe</button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <DisplayErrorDetail detailStatus={detailStatus} />
            )}



            <div className='detailsFooter'></div>


        </div>
    )
}
export default RecipeDetailsPage

import React, { useState, useEffect, useRef } from 'react'
import { motion as m, AnimatePresence } from 'framer-motion'
import { useParams } from 'react-router-dom'
import './RecipeDetailsPage.css'

import useRecipeDetails from './detailFunctions/fetchRecipeDetails'
import CreateTags from '../CreateRecipePage/createForms/CreateTags'
import CreateIngredients from '../CreateRecipePage/createForms/CreateIngredients'
import CreateSteps from '../CreateRecipePage/createForms/CreateSteps'
import CreateSubRecipes from '../CreateRecipePage/createForms/CreateSubRecipes'
import EditTheDetail from '../components/EditTheDetail'
import DisplayPhoto from './detailComponents/DisplayPhoto'
import DisplayIngredients from './detailComponents/DisplayIngredients'
import DisplayDescription from './detailComponents/DisplayDescription'
import DisplaySteps from './detailComponents/DisplaySteps'
import DisplayTags from './detailComponents/DisplayTags'
import DisplaySubRecipes from './detailComponents/DisplaySubRecipes'
import useScrollTracking from '../CreateRecipePage/createFunctions/scrollFunctions/useScrollTracking'
import basicAnimation from '../animations/basicAnimation'
import generateDeleteModal from './detailFunctions/generateDeleteModal'

import deleteEntireRecipe from './detailFunctions/deleteEntireRecipe'
import DisplayMultiplier from './detailComponents/DisplayMultiplier'
import NavBar from '../components/NavBar'
import { FaInfo } from "react-icons/fa";
import { LuAlarmClock } from "react-icons/lu";

import handleApiStatus from '../RecipeHomePage/homeFunctions/handleApiStatus'


const RecipeDetailsPage = () => {

    const { recipeID } = useParams()
    const horizontalScrollRef = useRef(null)
    const [refresh, setRefresh] = useState(true)

    const { theMainRecipe, theSubRecipes, theParentRecipes, isLoaded, detailStatus } = useRecipeDetails(recipeID, refresh)
    const recipeDisplay = [theMainRecipe].concat(theSubRecipes)
    const scrollIndex = useScrollTracking(horizontalScrollRef, isLoaded)
    const [displayId, setDisplayId] = useState(recipeID)
    // const [deleteModal, setDeleteModal] = useState(false)
    const [deleteStatus, setDeleteStatus] = useState('')

    // edit properties
    const [letsEdit, setLetsEdit] = useState(false)
    const [editView, setEditView] = useState('')
    const [multiplier, setMultiplier] = useState(1)
    const [subRecipePackage, setSubRecipePackage] = useState([])
    const [ingredientPackage, setIngredientPackage] = useState([])
    const [stepPackage, setStepPackage] = useState([])
    const [tagPackage, setTagPackage] = useState([])

    // updates your scroll sync
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

            <NavBar navPackage={{ section: 'details', letsEdit, setLetsEdit, setEditView, horizontalScrollRef }} />

            {generateDeleteModal(deleteStatus, setDeleteStatus)}

            <AnimatePresence mode='wait' initial={true}>
                {editView.length > 0 && (
                    <m.div className='addViewContainer' key='addViewContainer'
                        variants={basicAnimation}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                    >
                        {generateAddModalType(editView)}
                        <div className='quarterCircleAddView'></div>
                    </m.div>
                )}
            </AnimatePresence>


            {isLoaded ? (
                <AnimatePresence mode='wait' initial={true}>
                    <m.div className='detailSliderContainer' ref={horizontalScrollRef}
                        key="detailSliderContainer"
                        variants={basicAnimation}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                    >
                        {recipeDisplay.map((recipe, i) => (
                            <div key={i} className='recipeDetailsScrollContainer'>
                                <div className='recipeDetailContainer' >
                                    <div className='detailsTopDisplay'>

                                        <div className='detailsTopInfo'>

                                            <DisplayPhoto
                                                editPackage={{ letsEdit, refresh, setRefresh }}
                                                detailPackage={{ displayId, picture: recipe.recipeDetails.picture }}
                                            />

                                            <div className='prepServings'>
                                                <div className='detailsPrep'>
                                                    <LuAlarmClock />
                                                    <EditTheDetail
                                                        category={{ type: 'prep_time', detail: recipe.recipeDetails.prep_time, target_id: displayId }}
                                                        editPackage={{ letsEdit, refresh, setRefresh }}
                                                    />
                                                </div>
                                                <div className='detailsServings'>
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

                                    <DisplayMultiplier multiplier={multiplier} setMultiplier={setMultiplier} />

                                    <DisplayIngredients
                                        editPackage={{ letsEdit, refresh, setRefresh, multiplier }}
                                        detailPackage={{ ingredients: recipe.ingredients, setEditView }}
                                    />
                                    <DisplaySteps
                                        editPackage={{ letsEdit, refresh, setRefresh }}
                                        detailPackage={{ instructions: recipe.steps, setEditView }}
                                    />

                                    <DisplaySubRecipes
                                        editPackage={{ displayId, recipeID, refresh, letsEdit, setRefresh, setEditView }}
                                        detailPackage={{ scrollIndex, recipe, theSubRecipes, theParentRecipes, horizontalScrollRef }}
                                    />

                                    {scrollIndex === 0 && (
                                        <button onClick={() => deleteEntireRecipe(displayId, setDeleteStatus)}>Delete This Recipe</button>
                                    )}

                                </div>
                            </div>
                        ))}
                    </m.div>
                </AnimatePresence>
            ) : (
                <AnimatePresence mode='wait' initial={true}>
                    <m.div
                        className="detailErrorContainer"
                        key="detailErrorContainer"
                        variants={basicAnimation}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                    >
                        {handleApiStatus(detailStatus)}
                    </m.div>
                </AnimatePresence>
            )}

            {/* <div className='detailsFooter'></div> */}

        </div>
    )
}
export default RecipeDetailsPage

import React, { useState, useEffect, useRef } from 'react'
import { motion as m, AnimatePresence } from 'framer-motion'
import { useParams } from 'react-router-dom'
import './RecipeDetailsPage.css'

import useRecipeDetails from './detailFunctions/fetchRecipeDetails'
import CreateTags from '../CreateRecipePage/createForms/CreateTags'
import CreateIngredients from '../CreateRecipePage/createForms/CreateIngredients'
import CreateSteps from '../CreateRecipePage/createForms/CreateSteps'
import CreateSubRecipes from '../CreateRecipePage/createForms/CreateSubRecipes'
import DisplayPhoto from './detailComponents/DisplayPhoto'
import DisplayIngredients from './detailComponents/DisplayIngredients'
import DisplaySteps from './detailComponents/DisplaySteps'
import DisplayTags from './detailComponents/DisplayTags'
import DisplaySubRecipes from './detailComponents/DisplaySubRecipes'
import useScrollTracking from '../CreateRecipePage/createFunctions/scrollFunctions/useScrollTracking'
import basicAnimation from '../animations/basicAnimation'
import generateDeleteModal from './detailFunctions/generateDeleteModal'
import EditModal from '../components/EditModal'

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
    console.log('recipeDisplay', recipeDisplay)
    const scrollIndex = useScrollTracking(horizontalScrollRef, isLoaded)
    const [displayId, setDisplayId] = useState(recipeID)
    const [deleteStatus, setDeleteStatus] = useState('')
    // console.log('displayId', displayId)
    // console.log('scrollIndex', scrollIndex)
    // console.log('isLoaded', isLoaded)
    // console.log('horizontalScrollRef', horizontalScrollRef.current)

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


    const [editModalView, setEditModalView] = useState(false)
    const [newEdit, setNewEdit] = useState('')
    const [editType, setEditType] = useState('')
    const [editId, setEditId] = useState('')
    console.log('details page', editType, editId, newEdit)
    function openEditModal(type, detail, editId) {
        console.log('type, detail, editId', type, detail, editId)
        setEditType(type)
        setEditId(editId)
        setNewEdit(detail)
        setEditModalView(true)
    }





    return (
        <div className='detailsPage'>

            <NavBar navPackage={{ section: 'details', letsEdit, setLetsEdit, setEditView, horizontalScrollRef }} />

            {generateDeleteModal(deleteStatus, setDeleteStatus)}

            {editModalView && (
                <EditModal
                    editPackage={{ editType, editId, newEdit, setNewEdit }}
                    refreshPackage={{ setEditModalView, refresh, setRefresh }}
                />
            )}

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
                            <div key={i} className='recipeDetailsScrollContainer' >
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
                                                    <p onClick={letsEdit ? () => openEditModal('prep_time', recipe.recipeDetails.prep_time, displayId) : null}>{recipe.recipeDetails.prep_time}</p>
                                                </div>
                                                <div className='detailsServings'>
                                                    <p><FaInfo /></p>
                                                    <p onClick={letsEdit ? () => openEditModal('servings', recipe.recipeDetails.servings, displayId) : null}>{recipe.recipeDetails.servings}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='detailsBottomInfo'>
                                            <div className='detailsTitleDisplay'>
                                                <p onClick={letsEdit ? () => openEditModal('title', recipe.recipeDetails.title, displayId) : null}>{recipe.recipeDetails.title}</p>
                                            </div>

                                            <DisplayTags
                                                editPackage={{ letsEdit, refresh, setRefresh }}
                                                detailPackage={{ tags: recipe.tags, setEditView }}
                                            />
                                        </div>
                                    </div>

                                    <div className='detailsDescriptionParts'>
                                        <p onClick={letsEdit ? () => openEditModal('description', recipe.recipeDetails.description, displayId) : null}>{recipe.recipeDetails.description}</p>
                                    </div>

                                    <DisplayMultiplier multiplier={multiplier} setMultiplier={setMultiplier} />

                                    <DisplayIngredients
                                        editPackage={{ letsEdit, openEditModal }}
                                        detailPackage={{ ingredients: recipe.ingredients, multiplier, setEditView }}
                                    />

                                    <DisplaySteps
                                        editPackage={{ letsEdit, openEditModal }}
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
                <div
                    className="detailErrorContainer"
                    key="detailErrorContainer"
                    variants={basicAnimation}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                >
                    {handleApiStatus(detailStatus)}
                </div>
            )}
        </div >
    )
}
export default RecipeDetailsPage

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
    const [refresh, setRefresh] = useState(true)
    const { theMainRecipe, theSubRecipes, theParentRecipes, isLoaded, detailStatus } = useRecipeDetails(recipeID, refresh)
    const recipeDisplay = [theMainRecipe].concat(theSubRecipes)
    const [multiplier, setMultiplier] = useState(1)
    const [deleteStatus, setDeleteStatus] = useState('')
    // scrolling
    const horizontalScrollRef = useRef(null)
    const scrollIndex = useScrollTracking(horizontalScrollRef, isLoaded)
    const [displayId, setDisplayId] = useState(recipeID)
    // edit single category
    const [letsEdit, setLetsEdit] = useState(false)
    const [addMoreView, setAddMoreView] = useState('') // displays form for single category
    const [subRecipePackage, setSubRecipePackage] = useState([])
    const [ingredientPackage, setIngredientPackage] = useState([])
    const [stepPackage, setStepPackage] = useState([])
    const [tagPackage, setTagPackage] = useState([])
    // edit single detail
    const [editModalView, setEditModalView] = useState(false)
    const [newEdit, setNewEdit] = useState('')
    const [editType, setEditType] = useState('')
    const [editId, setEditId] = useState('')

    // updates your scroll sync
    useEffect(() => {
        if (isLoaded) {
            setDisplayId(recipeDisplay[scrollIndex].recipeDetails.recipe_id)
        }
    }, [scrollIndex, isLoaded])
    // opens modal with proper inputs
    function openEditModal(type, detail, editId) {
        // console.log('type, detail, editId', type, detail, editId)
        setEditType(type)
        setEditId(editId)
        setNewEdit(detail)
        setEditModalView(true)
    }

    // generates the addition of single category items (createForms)
    function generateAddModalType(addModalType) {
        switch (addModalType) {
            case 'subRecipe':
                return (
                    <div className='createSingleForm'>
                        <CreateSubRecipes
                            dataPackage={{ displayId, subRecipePackage, setSubRecipePackage }}
                            editPackage={{ addMoreView, setAddMoreView, refresh, setRefresh }}
                        />
                    </div>
                )
            case 'ingredient':
                return (
                    <div className='createSingleForm'>
                        <CreateIngredients
                            dataPackage={{ displayId, ingredientPackage, setIngredientPackage }}
                            editPackage={{ addMoreView, setAddMoreView, refresh, setRefresh }}
                        />
                    </div>
                )
            case 'tag':
                return (
                    <div className='createSingleForm'>
                        <CreateTags
                            dataPackage={{ displayId, tagPackage, setTagPackage }}
                            editPackage={{ addMoreView, setAddMoreView, refresh, setRefresh }}
                        />
                    </div>
                )
            case 'step':
                return (
                    <div className='createSingleForm'>
                        <CreateSteps
                            dataPackage={{ displayId, stepPackage, setStepPackage }}
                            editPackage={{ addMoreView, setAddMoreView, refresh, setRefresh }}
                        />
                    </div>
                )
            default:
                return null
        }
    }



    return (
        <div className='detailsPage'>

            <NavBar navPackage={{ section: 'details', letsEdit, setLetsEdit, setAddMoreView, horizontalScrollRef }} />

            {generateDeleteModal(deleteStatus, setDeleteStatus)}

            {editModalView && (
                <EditModal
                    editPackage={{ editType, editId, newEdit, setNewEdit }}
                    refreshPackage={{ setEditModalView, refresh, setRefresh }}
                />
            )}

            <AnimatePresence mode='wait' initial={true}>
                {addMoreView.length > 0 && (
                    <m.div className='addViewContainer' key='addViewContainer'
                        variants={basicAnimation}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                    >
                        {generateAddModalType(addMoreView)}
                        <div className='quarterCircleAddView'></div>
                    </m.div>
                )}
            </AnimatePresence>


            {isLoaded && (
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
                                                detailPackage={{ tags: recipe.tags, setAddMoreView }}
                                            />
                                        </div>
                                    </div>

                                    <div className='detailsDescriptionParts'>
                                        <p onClick={letsEdit ? () => openEditModal('description', recipe.recipeDetails.description, displayId) : null}>{recipe.recipeDetails.description}</p>
                                    </div>

                                    <DisplayMultiplier multiplier={multiplier} setMultiplier={setMultiplier} />

                                    <div className='displayIngredientSteps'>
                                        <DisplayIngredients
                                            editPackage={{ letsEdit, openEditModal }}
                                            detailPackage={{ ingredients: recipe.ingredients, multiplier, setAddMoreView }}
                                        />

                                        <DisplaySteps
                                            editPackage={{ letsEdit, openEditModal }}
                                            detailPackage={{ instructions: recipe.steps, setAddMoreView }}
                                        />
                                    </div>

                                    <DisplaySubRecipes
                                        editPackage={{ displayId, recipeID, refresh, letsEdit, setRefresh, setAddMoreView }}
                                        detailPackage={{ scrollIndex, recipe, theSubRecipes, theParentRecipes, horizontalScrollRef }}
                                    />

                                    <div className='deleteThisRecipe'>
                                        {scrollIndex === 0 && (
                                            <button onClick={() => deleteEntireRecipe(displayId, setDeleteStatus)}>Delete This Recipe</button>
                                        )}
                                    </div>

                                </div>
                            </div>
                        ))}
                    </m.div>
                </AnimatePresence>
            )}

            {!isLoaded && (
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



        </div >
    )
}
export default RecipeDetailsPage

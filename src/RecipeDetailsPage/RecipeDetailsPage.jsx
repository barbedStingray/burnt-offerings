import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { motion as m, AnimatePresence } from 'framer-motion'
import './RecipeDetailsPage.css'

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

import deleteSoloDetail from './detailFunctions/deleteSoloDetail'
import deleteEntireRecipe from './detailFunctions/deleteEntireRecipe'
import DisplayMultiplier from './detailComponents/DisplayMultiplier'
import NavBar from '../components/NavBar'


const RecipeDetailsPage = () => {

    const dispatch = useDispatch()
    const { mainRecipe, parentRecipes, subRecipes } = useSelector((state) => state.recipe)
    const recipeID = mainRecipe.recipeDetails.recipe_id
    const recipeDisplay = [mainRecipe].concat(subRecipes)
    const [multiplier, setMultiplier] = useState(1)
    const [deleteStatus, setDeleteStatus] = useState('')
    // scrolling
    const horizontalScrollRef = useRef(null)
    const scrollIndex = useScrollTracking(horizontalScrollRef)
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
            setDisplayId(recipeDisplay[scrollIndex].recipeDetails.recipe_id)
    }, [scrollIndex])

    // opens modal with proper inputs
    function openEditModal(type, detail, editId) {
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
                            editPackage={{ addMoreView, setAddMoreView, recipeID }}
                        />
                    </div>
                )
            case 'ingredient':
                return (
                    <div className='createSingleForm'>
                        <CreateIngredients
                            dataPackage={{ displayId, ingredientPackage, setIngredientPackage }}
                            editPackage={{ addMoreView, setAddMoreView, recipeID }}
                        />
                    </div>
                )
            case 'tag':
                return (
                    <div className='createSingleForm'>
                        <CreateTags
                            dataPackage={{ displayId, tagPackage, setTagPackage }}
                            editPackage={{ addMoreView, setAddMoreView, recipeID }}
                        />
                    </div>
                )
            case 'step':
                return (
                    <div className='createSingleForm'>
                        <CreateSteps
                            dataPackage={{ displayId, stepPackage, setStepPackage }}
                            editPackage={{ addMoreView, setAddMoreView, recipeID }}
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
                    refreshPackage={{ setEditModalView, recipeID }}
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


            <AnimatePresence mode='wait' initial={true}>
                <m.div className='detailHorizontalSlide' ref={horizontalScrollRef}
                    key="detailSliderContainer"
                    variants={basicAnimation}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                >
                    {recipeDisplay.map((recipe, i) => (
                        <div key={i} className='detailVerticalSlide' >
                            <div className='detailRecipeContainer' >

                                <div className='detailsTopDisplay'>
                                    <div className='detailPhotoItems'>
                                        <DisplayPhoto
                                            editPackage={{ letsEdit }}
                                            detailPackage={{ displayId, picture: recipe.recipeDetails.picture, recipeID }}
                                        />
                                        <div className='prepServings'>
                                            <div className='detailsPrep'>
                                                {/* <LuAlarmClock /> */}
                                                <p onClick={letsEdit ? () => openEditModal('prep_time', recipe.recipeDetails.prep_time, displayId) : null}>{recipe.recipeDetails.prep_time}</p>
                                            </div>
                                            <div className='detailsServings'>
                                                {/* <p><FaInfo /></p> */}
                                                <p onClick={letsEdit ? () => openEditModal('servings', recipe.recipeDetails.servings, displayId) : null}>{recipe.recipeDetails.servings}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='detailTitleTags'>
                                        <div className='detailsTitleDisplay'>
                                            <p onClick={letsEdit ? () => openEditModal('title', recipe.recipeDetails.title, displayId) : null}>{recipe.recipeDetails.title}</p>
                                        </div>

                                        <DisplayTags
                                            editPackage={{ letsEdit }}
                                            detailPackage={{ tags: recipe.tags, setAddMoreView, recipeID }}
                                        />

                                        <div className='detailDescriptionLarge'>
                                            <p onClick={letsEdit ? () => openEditModal('description', recipe.recipeDetails.description, displayId) : null}>{recipe.recipeDetails.description}</p>
                                        </div>

                                    </div>
                                </div>

                                <div className='detailDescriptionSmall'>
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
                                    editPackage={{ letsEdit, setAddMoreView, i, horizontalScrollRef }}
                                    detailPackage={{ recipe, subRecipes, parentRecipes, mainRecipe }}
                                />

                                <div className='deleteThisRecipe'>
                                    {i === 0 ? (
                                        <button className='deleteButton' onClick={() => deleteEntireRecipe(displayId, setDeleteStatus)}>Delete This Recipe</button>
                                    ) : (
                                        <button className='deleteButton' onClick={() => deleteSoloDetail('subRecipe', displayId, recipeID, dispatch, null, recipeID)}>Remove Sub Recipe</button>
                                    )}
                                </div>

                            </div>
                        </div>
                    ))}
                </m.div>
            </AnimatePresence>

        </div >
    )
}
export default RecipeDetailsPage

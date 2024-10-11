import React, { useState, useRef } from 'react'
import './createRecipePage.css'

import CreateDetails from './createForms/CreateDetails'
import CreateSubRecipes from './createForms/CreateSubRecipes'
import CreateIngredients from './createForms/CreateIngredients'
import CreateSteps from './createForms/CreateSteps'
import CreateTags from './createForms/CreateTags'
import SubmitRecipe from './createForms/SubmitRecipe'
import FormShortcuts from './createComponents/FormShortcuts'
import useScrollTracking from './createFunctions/scrollFunctions/useScrollTracking'
import NavBar from '../components/NavBar'

const CreateNewRecipe = () => {


    const [newRecipeDetails, setNewRecipeDetails] = useState({
        newTitle: '',
        description: '',
        prep_time: '',
        servings: '',
        is_parent_recipe: false,
        picture: 'no photo'
    })
    const [subRecipePackage, setSubRecipePackage] = useState([])
    const [ingredientPackage, setIngredientPackage] = useState([])
    const [stepPackage, setStepPackage] = useState([])
    const [tagPackage, setTagPackage] = useState([])
    const formContainerRef = useRef(null)
    const scrollIndex = useScrollTracking(formContainerRef)
    const createForms = [
        <CreateDetails dataPackage={{ newRecipeDetails, setNewRecipeDetails }} />,
        <CreateSubRecipes dataPackage={{ subRecipePackage, setSubRecipePackage }} />,
        <CreateIngredients dataPackage={{ ingredientPackage, setIngredientPackage }} />,
        <CreateSteps dataPackage={{ stepPackage, setStepPackage }} />,
        <CreateTags dataPackage={{ tagPackage, setTagPackage }} />,
        <SubmitRecipe dataPackage={{ newRecipeDetails, subRecipePackage, ingredientPackage, stepPackage, tagPackage }} />
    ]

    return (
        <div className='createPage'>

            <NavBar navPackage={{ section: 'create' }} />

            <div className='createDisplay'>
                <h1>CREATE RECIPE</h1>
                <p>DETAILS</p>
                {/* {JSON.stringify(newRecipeDetails)} */}
                <p>SUB RECIPE PACKAGE</p>
                {JSON.stringify(subRecipePackage)}
                <p>INGREDIENTS</p>
                {JSON.stringify(ingredientPackage)}
                <p>STEPS</p>
                {JSON.stringify(stepPackage)}
                <p>TAG PACKAGE</p>
                {JSON.stringify(tagPackage)}
            </div>

            <div className='createFooter'>

                <FormShortcuts scrollIndex={scrollIndex} formContainerRef={formContainerRef} />

                {/* snap forms */}
                <div className={`createForms`} ref={formContainerRef}>
                    {createForms.map((formContent, i) => (
                        <div key={i} className='createSingleForm'>
                            {formContent}
                        </div>
                    ))}
                </div>
            </div>

        </div >
    )
}

export default CreateNewRecipe

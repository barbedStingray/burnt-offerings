import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import './createRecipePage.css'


import CreateDetails from './createForms/CreateDetails'
import CreateSubRecipes from './createForms/CreateSubRecipes'
import CreateIngredients from './createForms/CreateIngredients'
import CreateSteps from './createForms/CreateSteps'
import CreateTags from './createForms/CreateTags'
import SubmitRecipe from './createForms/SubmitRecipe'


// todo implement react Icons use gi
import { GiFishbone } from "react-icons/gi";
import { GiRawEgg } from "react-icons/gi";
import { GiSandwich } from "react-icons/gi";
import { GiFruitBowl } from "react-icons/gi";
import { GiHotMeal } from "react-icons/gi";




// TODO REFACTOR single responsibilites
// todo is redux useful anymore? 

const CreateNewRecipe = () => {


    const [newRecipeDetails, setNewRecipeDetails] = useState({
        newTitle: '',
        description: '',
        prep_time: '',
        servings: '',
        // is_sub_recipe: false,
        is_parent_recipe: false,
        picture: 'no photo'
    })
    const [subRecipePackage, setSubRecipePackage] = useState([])
    const [ingredientPackage, setIngredientPackage] = useState([])
    const [stepPackage, setStepPackage] = useState([])
    const [tagPackage, setTagPackage] = useState([])

    const [formIndex, setFormIndex] = useState(0)
    const createForms = [
        <CreateDetails dataPackage={{ newRecipeDetails, setNewRecipeDetails }} />,
        <CreateSubRecipes dataPackage={{ subRecipePackage, setSubRecipePackage }} />,
        <CreateIngredients dataPackage={{ ingredientPackage, setIngredientPackage }} />,
        <CreateSteps dataPackage={{ stepPackage, setStepPackage }} />,
        <CreateTags dataPackage={{ tagPackage, setTagPackage }} />,
        <SubmitRecipe dataPackage={{ newRecipeDetails, subRecipePackage, ingredientPackage, stepPackage, tagPackage }} />
    ]
    const formShortcuts = ['D', 'R', 'I', 'S', 'T', 'Submit']



    function deleteTag(i, dataPackage, setDataPackage) { // needs to be modular
        console.log('tagindex', i)
        const newPackage = dataPackage.filter((_, index) => index !== i)
        console.log('newPackage', newPackage)
        setDataPackage(newPackage)
    }


    useEffect((e) => {
        console.log('checking if parent')
        if (subRecipePackage.length === 0) {
            setNewRecipeDetails({ ...newRecipeDetails, is_parent_recipe: false })
        } else {
            setNewRecipeDetails({ ...newRecipeDetails, is_parent_recipe: true })
        }
    }, [subRecipePackage])


    const nextForm = (formIndex) => {
        console.log('view next form', formIndex)
        if (formIndex < createForms.length - 1) {
            setFormIndex(formIndex + 1)
        } else {
            console.log('Last Page!')
        }
    }
    const previousForm = (formIndex) => {
        console.log('view next form', formIndex)
        if (formIndex > 0) {
            setFormIndex(formIndex - 1)
        } else {
            console.log('First Page!')
        }
    }

    const [photoModule, setPhotoModule] = useState(false)
    const addNewPhoto = () => {
        console.log('adding photo')

    }

    function generatePhoto(iconString) {
        switch (iconString) {
            case 'dinner':
                return <GiHotMeal />
            case 'egg':
                return <GiRawEgg />
            case 'fish':
                return <GiFishbone />
            case 'lunch':
                return <GiSandwich />
            case 'snack':
                return <GiFruitBowl />
        }
    }

    const reactIcons = [
        {
            iconName: 'dinner',
            icon: <GiHotMeal />
        },
        {
            iconName: 'egg',
            icon: <GiRawEgg />
        },
        {
            iconName: 'fish',
            icon: <GiFishbone />
        },
        {
            iconName: 'lunch',
            icon: <GiSandwich />
        },
        {
            iconName: 'snack',
            icon: <GiFruitBowl />
        }
    ]


    return (
        <div className='createNewRecipe'>



            <div className='createDisplay'>
                <h1>CREATE RECIPE</h1>
                <p>DETAILS</p>
                <div>Photo: {newRecipeDetails.picture}</div>
                {generatePhoto(newRecipeDetails.picture)}
                <button onClick={() => setPhotoModule(!photoModule)}>Add Photo</button>
                {photoModule ? (
                    <div>
                        <p>Lets Get some Options</p>
                        <button disabled >Own Photo</button>
                        <h3>Icon List</h3>
                        {reactIcons.map((icon, i) => (
                            <div
                                key={i}
                                onClick={() => {
                                    setNewRecipeDetails({ ...newRecipeDetails, picture: icon.iconName })
                                    setPhotoModule(!photoModule)
                                }}
                            >{icon.iconName}{icon.icon}</div>
                        ))}
                    </div>
                ) : (
                    <></>
                )}
                <p>Title: {newRecipeDetails.newTitle}</p>
                <p>Description: {newRecipeDetails.description}</p>
                <p>Servings: {newRecipeDetails.servings}</p>
                <p>prep_time: {newRecipeDetails.prep_time}</p>
                <p>is_parent_recipe: {newRecipeDetails.is_parent_recipe ? 'true' : 'false'}</p>
                {/* {JSON.stringify(newRecipeDetails)} */}

                <p>SUB RECIPE PACKAGE</p>
                {/* {subRecipePackage.map((recipe, i) => (
                    <div key={i}>
                        <p>{recipe.title}</p>
                        <button onClick={() => deleteTag(i, subRecipePackage, setSubRecipePackage)}>Delete</button>
                    </div>
                ))} */}
                {JSON.stringify(subRecipePackage)}

                <p>INGREDIENTS</p>
                {JSON.stringify(ingredientPackage)}

                <p>STEPS</p>
                {JSON.stringify(stepPackage)}

                <p>TAG PACKAGE</p>
                {/* {tagPackage.map((tag, i) => (
                    <div key={i}>
                        <p>{tag.tag}</p>
                        <button onClick={() => deleteTag(i, tagPackage, setTagPackage)}>Delete</button>
                    </div>
                ))} */}
                {JSON.stringify(tagPackage)}

            </div>

            <div className='createForm'>
                <div>
                    {createForms[formIndex]}
                </div>
                <br />

                <button
                    onClick={() => previousForm(formIndex)}
                    disabled={formIndex === 0}
                >Previous</button>
                {formShortcuts.map((label, i) => (
                    <button // Todo turn into likely div later
                        key={i}
                        onClick={() => setFormIndex(i)}
                    >{label}</button>
                ))}
                <button
                    onClick={() => nextForm(formIndex)}
                    disabled={formIndex === createForms.length - 1}
                >Next</button>
            </div>





            {/* // todo - review page with submit button */}
            {/* <button onSubmit={submitNewRecipe}>Create Recipe</button> */}

        </div >
    )
}

export default CreateNewRecipe
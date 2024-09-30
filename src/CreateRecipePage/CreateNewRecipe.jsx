import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
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

import { LiaCookieBiteSolid } from "react-icons/lia";



// TODO REFACTOR single responsibilites
// todo is redux useful anymore? 

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

    const [formIndex, setFormIndex] = useState(0)
    const formContainerRef = useRef(null)
    const createForms = [
        <CreateDetails dataPackage={{ newRecipeDetails, setNewRecipeDetails }} />,
        <CreateSubRecipes dataPackage={{ subRecipePackage, setSubRecipePackage }} />,
        <CreateIngredients dataPackage={{ ingredientPackage, setIngredientPackage }} />,
        <CreateSteps dataPackage={{ stepPackage, setStepPackage }} />,
        <CreateTags dataPackage={{ tagPackage, setTagPackage }} />,
        <SubmitRecipe dataPackage={{ newRecipeDetails, subRecipePackage, ingredientPackage, stepPackage, tagPackage }} />
    ]
    const formShortcuts = ['MR', 'SR', 'IN', 'ST', 'TA', 'Check']

    useEffect(() => {
        // picking up my formIndex for scroll
        const handleScroll = () => {
            const formWidth = formContainerRef.current.clientWidth
            const currentScroll = formContainerRef.current.scrollLeft
            const newIndex = Math.round(currentScroll / formWidth)
            setFormIndex(newIndex)
        }
        formContainerRef.current.addEventListener('scroll', handleScroll)
        // cleanup function
        return () => {
            if (formContainerRef.current) {
                formContainerRef.current.removeEventListener('scroll', handleScroll)
            }
        }
    }, [])

// deletePackageItem
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


    const scrollToForm = (formIndex) => {
        console.log('scrolling to', formIndex)
        const formWidth = formContainerRef.current.clientWidth // set width
        formContainerRef.current.scrollTo({
            left: formWidth * formIndex, // scroll to correct position
            behavior: 'smooth'
        })
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
            <div className='createQuarter'></div>

            <div className='createRecipeHeader'>
                <Link className='createToHomeLink' to={'/'}><LiaCookieBiteSolid /></Link>
            </div>


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



            <div className='createFormSubmission'>

                {/* snap scroll... */}
                <div className={`createForms`} ref={formContainerRef}>
                    {createForms.map((formContent, i) => (
                        <div key={i} className='createSingleForm'>
                            {formContent}
                        </div>
                    ))}
                </div>

                <div className='createFormNavigation'>
                    {formShortcuts.map((label, i) => (
                        <div
                            className={`
                                navigateForm
                                ${formIndex === i ? 'identifyNavigate' : ''}
                                ${i === formShortcuts.length - 1 ? 'lastNavigate' : ''}
                                `}
                            key={i}
                            onClick={() => scrollToForm(i)}
                        >{label}</div>
                    ))}
                </div>

            </div>


        </div >
    )
}

export default CreateNewRecipe

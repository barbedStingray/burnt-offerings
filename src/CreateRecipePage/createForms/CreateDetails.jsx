import React, { useState } from 'react'
import useAllCategory from '../createFunctions/allOfCategory'

import DetailInput from '../../components/DetailInput'
import handleDetailChange from '../createFunctions/handleDetailChange'
import handleValueIsPresent from '../createFunctions/handleValueIsPresent'
import ImageUpload from '../../components/ImageUpload'


import { GiFishbone } from "react-icons/gi";
import { GiRawEgg } from "react-icons/gi";
import { GiSandwich } from "react-icons/gi";
import { GiFruitBowl } from "react-icons/gi";
import { GiHotMeal } from "react-icons/gi";


const CreateDetails = ({ dataPackage }) => {

    const { newRecipeDetails, setNewRecipeDetails } = dataPackage
    const [allRecipes, allRecipesStatus] = useAllCategory('/api/recipes/titleCheck')

    const newRecipeDetailInputs = [
        {
            name: 'newTitle',
            className: 'createDetailsInput',
            type: 'text',
            placeholder: 'Recipe Title',
            required: true,
            maxLength: 40,
            minLength: 1,
            autoComplete: 'off',
            value: newRecipeDetails.newTitle,
            onChange: (e) => handleDetailChange(e, newRecipeDetails, setNewRecipeDetails)
        },
        {
            name: 'description',
            className: 'createDetailsTextArea',
            type: 'textarea',
            placeholder: 'The Description of your Recipe!',
            required: false,
            maxLength: 300,
            minLength: 0,
            autoComplete: 'off',
            value: newRecipeDetails.description,
            onChange: (e) => handleDetailChange(e, newRecipeDetails, setNewRecipeDetails)
        },
        {
            name: 'prep_time',
            className: 'createDetailsInput prep',
            type: 'text',
            placeholder: 'Prep Time',
            required: false,
            maxLength: 5,
            minLength: 1,
            autoComplete: 'off',
            value: newRecipeDetails.prep_time,
            onChange: (e) => handleDetailChange(e, newRecipeDetails, setNewRecipeDetails)
        },
        {
            name: 'servings',
            className: 'createDetailsInput prep',
            type: 'number',
            placeholder: 'Servings',
            required: false,
            maxLength: 999,
            minLength: 1,
            autoComplete: 'off',
            value: newRecipeDetails.servings,
            onChange: (e) => handleDetailChange(e, newRecipeDetails, setNewRecipeDetails)
        },
    ]


    const [photoModal, setPhotoModal] = useState(false)
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


    // handle photo solo
    const addCustomPhoto = (properties) => {
        setNewRecipeDetails({ ...newRecipeDetails, picture: properties })
    }

    function letsCheckValues(e, newObject) {

        // todo format your white space here! for the titles...

        e.preventDefault()
        const checkValueArray = Object.values(newObject)
        console.log('checkValueArray', checkValueArray)
        const isValue = handleValueIsPresent(...checkValueArray)
        if (!isValue) return alert('please check your inputs!')

        // ! check for duplicate name
        const isDuplicate = allRecipes.map((recipe) => recipe.title.toLowerCase()).includes(newObject.newTitle.toLowerCase())
        console.log('isDuplicate', isDuplicate)
        if (isDuplicate) return alert('Your title is a duplicate!')

        alert('variables are good!')
    }

    return (

        <>
            {photoModal ? (
                <div className='createDetailsAddPhotoPage'>
                    <div className='createAddPhotoDisplay'>
                        {generatePhoto(newRecipeDetails.picture)}
                    </div>
                    <ImageUpload photoFunction={addCustomPhoto} />

                    <div className='createIconSelectors'>
                        {reactIcons.map((icon, i) => (
                            <div
                                key={i}
                                className={`createSingleIcon ${newRecipeDetails.picture === icon.iconName ? 'iconSelect' : ''}`}
                                onClick={() => setNewRecipeDetails({ ...newRecipeDetails, picture: icon.iconName })}
                            >
                                {icon.icon}
                            </div>
                        ))}
                    </div>
                    <button onClick={() => setPhotoModal(false)} className='createAddImageButton'>Back</button>
                </div>
            ) : (
                <>
                    <div className='createDetailsFormPage'>

                        <p className='createDetailsTitle'>Recipe Details</p >

                        <form className='createDetailInputForm'>

                            {newRecipeDetailInputs.map((input, i) => (
                                <DetailInput key={i} inputDetails={input} />
                            ))}

                            <button className='createAddImageButton' onClick={(e) => {
                                e.preventDefault()
                                setPhotoModal(true)
                            }}>
                                Add Photo
                            </button>

                        </form>


                        {/* // todo Need to implement checks before submission */}
                        {/* <button onClick={(e) => letsCheckValues(e, newRecipeDetails)}>Check/Next</button> */}
                    </div >
                </>

            )}
        </>

    )
}

export default CreateDetails

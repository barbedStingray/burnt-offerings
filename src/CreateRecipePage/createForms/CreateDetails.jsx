import React, { useState } from 'react'
import useAllCategory from '../createFunctions/allOfCategory'

import DetailInput from '../../components/DetailInput'
import handleDetailChange from '../createFunctions/handleDetailChange'
import handleValueIsPresent from '../createFunctions/handleValueIsPresent'
import ImageUpload from '../../components/ImageUpload'

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
        <div className='createDetailsFormPage'>


            <p className='createDetailsTitle'>Recipe Details</p>

            <form className='createDetailInputForm'>

                <ImageUpload photoFunction={addCustomPhoto} />

                {newRecipeDetailInputs.map((input, i) => (
                    <DetailInput key={i} inputDetails={input} />
                ))}
            </form>


            {/* // todo Need to implement checks before submission */}
            {/* <button onClick={(e) => letsCheckValues(e, newRecipeDetails)}>Check/Next</button> */}
        
        </div>
    )
}

export default CreateDetails

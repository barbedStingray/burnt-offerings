import React, { useState } from 'react'
import useAllCategory from '../../utilities/allOfCategory'

import DetailInput from '../../components/DetailInput'
import handleDetailChange from '../../utilities/createHandlers/handleDetailChange'
import handleValueIsPresent from '../../utilities/createHandlers/handleValueIsPresent'

const CreateDetails = ({ dataPackage }) => {

    const { newRecipeDetails, setNewRecipeDetails } = dataPackage
    const [allRecipes, allRecipesStatus] = useAllCategory('/api/recipes/titleCheck')
    // console.log('allRecipes', allRecipes)

    const newRecipeDetailInputs = [
        {
            name: 'newTitle',
            type: 'text',
            placeholder: 'looped title...',
            required: true,
            maxLength: 40,
            minLength: 1,
            autoComplete: 'off',
            value: newRecipeDetails.newTitle,
            onChange: (e) => handleDetailChange(e, newRecipeDetails, setNewRecipeDetails)
        },
        {
            name: 'description',
            type: 'textarea',
            placeholder: 'looped textArea...',
            required: false,
            maxLength: 300,
            minLength: 0,
            autoComplete: 'off',
            value: newRecipeDetails.description,
            onChange: (e) => handleDetailChange(e, newRecipeDetails, setNewRecipeDetails)
        },
        {
            name: 'prep_time',
            type: 'text',
            placeholder: 'looped prep_time...',
            required: false,
            maxLength: 10,
            minLength: 1,
            autoComplete: 'off',
            value: newRecipeDetails.prep_time,
            onChange: (e) => handleDetailChange(e, newRecipeDetails, setNewRecipeDetails)
        },
        {
            name: 'servings',
            type: 'number',
            placeholder: 'looped servings...',
            required: false,
            maxLength: 5,
            minLength: 1,
            autoComplete: 'off',
            value: newRecipeDetails.servings,
            onChange: (e) => handleDetailChange(e, newRecipeDetails, setNewRecipeDetails)
        },
    ]

    function letsCheckValues(e, newObject) {
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
        <div>
            <h3>Recipe Details</h3>
            <form >
                {newRecipeDetailInputs.map((input, i) => (
                    <DetailInput key={i} inputDetails={input} />
                ))}
                <br />
                {/* {JSON.stringify(newRecipeDetails)} */}
                <button onClick={(e) => letsCheckValues(e, newRecipeDetails)}>Check/Next</button>
            </form>
        </div>
    )
}

export default CreateDetails

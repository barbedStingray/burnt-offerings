import React from 'react'

import useAllCategory from '../../utilities/allOfCategory'
import DetailInput from '../DetailInput'
import handleDetailChange from '../../utilities/createHandlers/handleDetailChange'

const AddDetails = ({ dataPackage }) => {

    // TODO ensure recipe 'newTitle' does not match any other title recipes...

    const [allRecipes, allRecipesStatus] = useAllCategory('/api/recipes/titleCheck')
    // console.log('allRecipes', allRecipes)
    const [newRecipeDetails, setNewRecipeDetails] = dataPackage
    const newRecipeDetailInputs = [
        {
            name: 'newTitle',
            type: 'text',
            placeholder: 'looped title...',
            required: true,
            maxLength: 40,
            minLength: 1,
            autoComplete: 'off',
            value: newRecipeDetails.title,
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

    return (
        <div>
            <h3>Recipe Details</h3>
            {newRecipeDetailInputs.map((input, i) => (
                <DetailInput key={i} inputDetails={input} />
            ))}
            <br />
            {JSON.stringify(newRecipeDetails)}
        </div>
    )
}

export default AddDetails

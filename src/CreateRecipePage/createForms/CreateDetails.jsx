import React from 'react'

import DetailInput from '../../components/DetailInput'
import handleDetailChange from '../createFunctions/handleDetailChange'
import inputLimits from '../../components/InputLimits'
import ImageUpload from '../../renderImage/ImageUpload'


const CreateDetails = ({ dataPackage }) => {


    const { newRecipeDetails, setNewRecipeDetails } = dataPackage

    const newRecipeDetailInputs = [
        {
            name: 'newTitle',
            className: 'createFormInput',
            type: 'text',
            placeholder: 'Recipe Title',
            required: true,
            maxLength: inputLimits['newTitle'],
            minLength: 1,
            autoComplete: 'off',
            value: newRecipeDetails.newTitle,
            onChange: (e) => handleDetailChange(e, newRecipeDetails, setNewRecipeDetails)
        },
        {
            name: 'description',
            className: 'createFormTextArea',
            type: 'textarea',
            placeholder: 'The Description of your Recipe!',
            required: false,
            maxLength: inputLimits['description'],
            minLength: 0,
            autoComplete: 'off',
            value: newRecipeDetails.description,
            onChange: (e) => handleDetailChange(e, newRecipeDetails, setNewRecipeDetails)
        },
        {
            name: 'prep_time',
            className: 'createFormInput',
            type: 'text',
            placeholder: 'Prep Time',
            required: false,
            maxLength: inputLimits['prep_time'],
            minLength: 1,
            autoComplete: 'off',
            value: newRecipeDetails.prep_time,
            onChange: (e) => handleDetailChange(e, newRecipeDetails, setNewRecipeDetails)
        },
        {
            name: 'servings',
            className: 'createFormInput',
            type: 'text',
            placeholder: 'Servings',
            required: false,
            maxLength: inputLimits['servings'],
            minLength: 1,
            autoComplete: 'off',
            value: newRecipeDetails.servings,
            onChange: (e) => handleDetailChange(e, newRecipeDetails, setNewRecipeDetails)
        },
    ]

    const addCustomPhoto = (properties) => {
        setNewRecipeDetails({ ...newRecipeDetails, picture: properties })
    }

    return (

        <div className='createFormPage'>

            <p className='createFormTitle'>Recipe Details</p >

            <div className='createFormBox'>
                <form className='createInputForm createDetailsForm'>
                    {newRecipeDetailInputs.slice(0, 2).map((input, i) => (
                        <DetailInput key={i} inputDetails={input} />
                    ))}
                    <div className="inputGroup">
                        {newRecipeDetailInputs.slice(2, 4).map((input, i) => (
                            <DetailInput key={i} inputDetails={input} />
                        ))}
                    </div>
                </form>
                <ImageUpload photoFunction={addCustomPhoto} recipeImage={newRecipeDetails.picture} />
            </div>
        </div >
    )
}
export default CreateDetails

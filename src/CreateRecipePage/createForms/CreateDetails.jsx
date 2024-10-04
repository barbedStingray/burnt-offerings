import React from 'react'
import axios from 'axios'

import DetailInput from '../../components/DetailInput'
import handleDetailChange from '../createFunctions/handleDetailChange'
import ImageUpload from '../../components/ImageUpload'
import checkDuplicateTitles from '../createFunctions/checkDuplicateTitles'
import useAllCategory from '../createFunctions/allOfCategory'
import handleValueIsPresent from '../createFunctions/handleValueIsPresent'


const CreateDetails = ({
    dataPackage,
    editPackage = { detailsModal: false, setDetailsModal: () => { } },
    detailsPackage = { recipeID: null, refresh: false, setRefresh: () => { } }
}) => {


    const [allRecipes, allRecipesStatus] = useAllCategory('/api/recipes/titleCheck')
    console.log('allRecipes', allRecipes)
    const { newRecipeDetails, setNewRecipeDetails } = dataPackage
    const { detailsModal, setDetailsModal } = editPackage
    const { recipeID, refresh, setRefresh } = detailsPackage
    const newRecipeDetailInputs = [
        {
            name: 'newTitle',
            className: 'createFormInput',
            type: 'text',
            placeholder: 'Recipe Title',
            required: true,
            maxLength: 30,
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
            maxLength: 300,
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
            maxLength: 5,
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
            maxLength: 5,
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




    async function postTitleDetails(recipeID, newRecipeDetails, allRecipes) {
        console.log('posting title details', recipeID, newRecipeDetails)


        // check for values
        const isValuePresent = handleValueIsPresent(newRecipeDetails)
        if (!isValuePresent) return
        // trimming
        Object.entries(newRecipeDetails).forEach(([key, value]) => {
            if (typeof value === 'string') {
                newRecipeDetails[key] = value.trim();
            }
        })
        // check for duplicate titles, but filter the original in case it doesnt change
        const filterTitleRecipes = allRecipes.filter((recipe) => recipe.title !== newRecipeDetails.newTitle)
        const isDuplicate = checkDuplicateTitles(newRecipeDetails, filterTitleRecipes)
        if (!isDuplicate) return

        try {
            // post new
            await axios.post(`/api/recipes/postOnlyTitle`, { recipeID, newRecipeDetails })
            // todo !! loading screen?
            // ? I dont think you'll have to clear...
            setRefresh(!refresh)
            setDetailsModal(false)
        } catch (error) {
            console.log('error client side postOnlyTags', error)
            alert('something went wrong posting only tags!')
        }
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

                {detailsModal && (
                    <div>
                        <button onClick={() => postTitleDetails(recipeID, newRecipeDetails, allRecipes)}>Submit Tags</button>
                        <button onClick={() => setDetailsModal(false)}>Cancel</button>
                    </div>
                )}

                <ImageUpload photoFunction={addCustomPhoto} recipeImage={newRecipeDetails.picture} />
            </div>

        </div >

    )
}

export default CreateDetails

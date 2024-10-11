import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import axios from 'axios'
import handleValueIsPresent from '../createFunctions/handleValueIsPresent'
import useAllCategory from '../createFunctions/allOfCategory'
import checkDuplicateTitles from '../createFunctions/checkDuplicateTitles'
import generateNewIcon from '../createFunctions/generateNewIcon'



const SubmitRecipe = ({ dataPackage }) => {
    const { newRecipeDetails, subRecipePackage, ingredientPackage, stepPackage, tagPackage } = dataPackage

    const navigate = useNavigate()

    const [allRecipes, allRecipesStatus] = useAllCategory('/api/recipes/titleCheck')
    // const [postModal, setPostModal] = useState(false) // modal toggle
    const [postModalDisplay, setPostModalDisplay] = useState('ready')
    const [navigateNewId, setNavigateNewId] = useState(0)



    const handleCreateRecipe = async () => {

        const isValuePresent = handleValueIsPresent(newRecipeDetails)
        if (!isValuePresent) return
        Object.entries(newRecipeDetails).forEach(([key, value]) => {
            if (typeof value === 'string') {
                newRecipeDetails[key] = value.trim();
            }
        })
        const titleCheck = newRecipeDetails.newTitle
        const isDuplicate = checkDuplicateTitles(titleCheck, allRecipes)
        if (isDuplicate) return

        if (newRecipeDetails.picture === 'no photo') {
            newRecipeDetails.picture = generateNewIcon()
        }

        // setPostModal(true)
        setPostModalDisplay('loading')

        try {
            console.log('submitting new recipe', newRecipeDetails, subRecipePackage, ingredientPackage, stepPackage, tagPackage)
            const postResponse = await axios.post(`/api/recipes/newRecipe`, { newRecipeDetails, subRecipePackage, ingredientPackage, stepPackage, tagPackage })
            // todo you return a response of success from db... tie up the loose end.
            setPostModalDisplay('success')
            setNavigateNewId(postResponse.data.newRecipeId)
        } catch (error) {
            console.log('error in recipe POST')
            setPostModalDisplay('error')
        }
    }

    // todo these can be LINKs
    function goToNewRecipe(id) {
        console.log('going to new recipe', id)
        navigate(`/recipeDetails/${id}`)
    }
    function goHome() {
        navigate('/')
    }


    function generatePostModal(activeString) {
        switch (activeString) {
            case 'ready':
                return (
                    <>
                        <h1>Create that Recipe!</h1>
                        <button className='fireButton' onClick={() => handleCreateRecipe()}>Create Your Recipe</button>
                    </>
                )
            case 'loading':
                return <div>
                    <h1>Loading Your Recipe!</h1>
                </div>
            case 'success':
                return (
                    <div>
                        <h1>Recipe Success!</h1>
                        <button onClick={() => goToNewRecipe(navigateNewId)}>Go To Recipe</button>
                        <button onClick={() => goHome()}>Home</button>
                    </div>
                )
            case 'error':
                return <div>
                    <h1>recipe error</h1>
                    <button onClick={() => setPostModalDisplay('ready')}>Womp Womp...</button>
                </div>
            default:
                return ''
        }
    }


    return (
        <div className='createFormPage'>

            <div >
                <p className='createFormTitle'>Review Your Recipe!</p>
            </div>

            <div className='createFormBox'>
                <div className='createInputForm'>
                    <p>When you're ready, hit submit!</p>
                </div>

                {generatePostModal(postModalDisplay)}

                <div className='submitRequirements'>
                    <p>Recipe Details (R): Required</p>
                    <p>Sub Recipes (sR): Not Required</p>
                    <p>Ingredients (IN): Not Required</p>
                    <p>Instructions (ST): Not Required</p>
                    <p>Instructions (TA): Not Required</p>
                </div>
            </div>
        </div>
    )
}

export default SubmitRecipe

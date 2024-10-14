import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import axios from 'axios'
import handleValueIsPresent from '../createFunctions/handleValueIsPresent'
import useAllCategory from '../createFunctions/allOfCategory'
import checkDuplicateTitles from '../createFunctions/checkDuplicateTitles'
import generateNewIcon from '../createFunctions/generateNewIcon'
import { GiGingerbreadMan } from "react-icons/gi";
import { FaSnowboarding } from "react-icons/fa";



const SubmitRecipe = ({ dataPackage }) => {
    const { newRecipeDetails, subRecipePackage, ingredientPackage, stepPackage, tagPackage } = dataPackage

    const navigate = useNavigate()

    const [allRecipes, allRecipesStatus] = useAllCategory('/api/recipes/titleCheck')
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
                    <div className='postModal'>
                        <button className='fireButton' onClick={() => handleCreateRecipe()}>Create Recipe!</button>
                    </div>
                )
            case 'loading':
                return (
                    <div className='postModal'>
                        <h1>Loading...</h1>
                        <div className="createApiStatus">
                            <GiGingerbreadMan />
                        </div>
                    </div>
                )
            case 'success':
                return (
                    <div className='postModal'>
                        <h1>Recipe Success!</h1>
                        <div className='postModalDiv'>
                            <button className='fireButton medFire make' onClick={() => goToNewRecipe(navigateNewId)}>Make It!</button>
                            <button className='createAddButton' onClick={() => goHome()}>Home</button>
                        </div>
                    </div>
                )
            case 'error':
                return (
                    <div className='postModal'>
                        <button className='createAddButton' onClick={() => setPostModalDisplay('ready')}>Retry</button>
                        <div className="homeApiError">
                            <FaSnowboarding />
                            <div className="homeApiErrorMessage">
                                <p>Check your Connection!</p>
                                <p>Hang Tight! </p>
                            </div>
                        </div>
                    </div>
                )
            default:
                return ''
        }
    }


    return (
        <div className='createFormPage'>

            <div >
                <p className='createFormTitle'>Recipe Review!</p>
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

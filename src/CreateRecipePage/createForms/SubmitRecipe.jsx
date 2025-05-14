import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

import axios from 'axios'
import handleValueIsPresent from '../createFunctions/handleValueIsPresent'
import useAllCategory from '../createFunctions/allOfCategory'
import checkDuplicateTitles from '../createFunctions/checkDuplicateTitles'
import generateNewIcon from '../createFunctions/generateNewIcon'
import { GiGingerbreadMan } from "react-icons/gi";
import { FaSnowboarding } from "react-icons/fa";



const SubmitRecipe = ({ dataPackage }) => {
    const dispatch = useDispatch()
    const { newRecipeDetails, subRecipePackage, ingredientPackage, stepPackage, tagPackage } = dataPackage
    const [allRecipes, allRecipesStatus] = useAllCategory('/api/recipes/titleCheck')
    const [postModalDisplay, setPostModalDisplay] = useState('ready')


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
            // console.log('submitting new recipe', newRecipeDetails, subRecipePackage, ingredientPackage, stepPackage, tagPackage)
            const postResponse = await axios.post(`/api/recipes/newRecipe`, { newRecipeDetails, subRecipePackage, ingredientPackage, stepPackage, tagPackage })
            
            // refresh reducer
            const results = await axios.get(`/api/recipes/details/${postResponse.data.newRecipeId}`)
            const { mainRecipe, subRecipes, parentRecipes } = results.data
            dispatch({ type: 'SET_RECIPE', payload: { mainRecipe, subRecipes, parentRecipes } })

            setPostModalDisplay('success')


        } catch (error) {
            console.log('error in recipe POST')
            setPostModalDisplay('error')
        }
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
                            <Link className='fireButton medFire make' to={'/recipeDetails'}></Link>
                            <Link className='basicButton' to={'/'}>Home</Link>
                        </div>
                    </div>
                )
            case 'error':
                return (
                    <div className='postModal'>
                        <button className='basicButton' onClick={() => setPostModalDisplay('ready')}>Retry</button>
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

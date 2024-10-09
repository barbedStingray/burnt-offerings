import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import axios from 'axios'
import handleValueIsPresent from '../createFunctions/handleValueIsPresent'
import useAllCategory from '../createFunctions/allOfCategory'
import checkDuplicateTitles from '../createFunctions/checkDuplicateTitles'
import generateNewIcon from '../createFunctions/generateNewIcon'
import generatePostModal from '../createFunctions/generatePostModal'



const SubmitRecipe = ({ dataPackage }) => {
    const { newRecipeDetails, subRecipePackage, ingredientPackage, stepPackage, tagPackage } = dataPackage

    const navigate = useNavigate()

    const [allRecipes, allRecipesStatus] = useAllCategory('/api/recipes/titleCheck')
    const [postModal, setPostModal] = useState(false) // modal toggle
    const [postModalDisplay, setPostModalDisplay] = useState('')
    const [navigateNewId, setNavigateNewId] = useState(0)



    const handleCreateRecipe = async () => {

        const isValuePresent = handleValueIsPresent(newRecipeDetails)
        if (!isValuePresent) return
        Object.entries(newRecipeDetails).forEach(([key, value]) => {
            if (typeof value === 'string') {
                newRecipeDetails[key] = value.trim();
            }
        })
        const isDuplicate = checkDuplicateTitles(newRecipeDetails, allRecipes)
        if (!isDuplicate) return
        
        if(newRecipeDetails.picture === 'no photo') {
            newRecipeDetails.picture = generateNewIcon()
        }

        setPostModal(true)
        setPostModalDisplay('loading')

        try {
            console.log('submitting new recipe', newRecipeDetails, subRecipePackage, ingredientPackage, stepPackage, tagPackage)
            const postResponse = await axios.post(`/api/recipes/newRecipe`, { newRecipeDetails, subRecipePackage, ingredientPackage, stepPackage, tagPackage })
            // you return a response of success from db... tie up the loose end.
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


    return (
        <div>

            <h3>Please Review Your Recipe!</h3>

            <p>When you're ready, hit submit!</p>

            <button onClick={() => handleCreateRecipe()}>Create Your Recipe</button>
            
            {postModal && (
                <div>
                    {generatePostModal(postModalDisplay)}
                    <button onClick={() => goToNewRecipe(navigateNewId)}>Go To Recipe</button>
                    <button onClick={() => goHome()}>Home</button>
                </div>
            )}



        </div>
    )
}

export default SubmitRecipe

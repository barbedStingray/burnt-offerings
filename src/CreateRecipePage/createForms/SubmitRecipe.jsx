import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import axios from 'axios'
import handleValueIsPresent from '../createFunctions/handleValueIsPresent'
import useAllCategory from '../createFunctions/allOfCategory'
import checkDuplicateTitles from '../createFunctions/checkDuplicateTitles'





const SubmitRecipe = ({ dataPackage }) => {
    const { newRecipeDetails, setNewRecipeDetails, subRecipePackage, ingredientPackage, stepPackage, tagPackage } = dataPackage

    const navigate = useNavigate()

    const [allRecipes, allRecipesStatus] = useAllCategory('/api/recipes/titleCheck')
    const [postModal, setPostModal] = useState(false) // modal toggle
    const [postModalDisplay, setPostModalDisplay] = useState('failure')
    const [navigateNewId, setNavigateNewId] = useState(0)


    function randomIconNumber() {
        return Math.floor(Math.random() * 5)
    }
    const iconStrings = ['dinner', 'fish', 'lunch', 'snack', 'egg']



    const handleCreateRecipe = async () => {
        // pass checks of first section
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
            // give it a string
            newRecipeDetails.picture = `${iconStrings[randomIconNumber()]}`
        }
        console.log('PHOTO STRING', newRecipeDetails.picture)

        // ! activate trying to post entire recipe
        setPostModal(true)
        setPostModalDisplay('loading')

        try {
            console.log('submitting new recipe', newRecipeDetails, subRecipePackage, ingredientPackage, stepPackage, tagPackage)
            const postResponse = await axios.post(`/api/recipes/newRecipe`, { newRecipeDetails, subRecipePackage, ingredientPackage, stepPackage, tagPackage })

            // ? Does this need to be in an if statement?
            if (postResponse.data.success) {
                console.log('success in recipe POST')
                setPostModalDisplay('success')

                // todo invalidate your caches here
            }

            // set your new recipe id
            setNavigateNewId(postResponse.data.newRecipeId)

            // todo RESET variables ? seems like it's resetting already

        } catch (error) {
            console.log('error in recipe POST')
            setPostModalDisplay('failure')
        }
    }



    function generatePostModal(activeString) {
        switch (activeString) {
            case 'loading':
                return <div>
                    <h1>recipe is loading</h1>
                </div>
            case 'success':
                return <div>
                    <h1>recipe success!</h1>
                </div>
            case 'failure':
                return <div>
                    <h1>recipe failure</h1>
                </div>
            default:
                return ''
        }
    }



    function goToNewRecipe(id) {
        console.log('going to new recipe', id)
        navigate(`/recipeDetails/${id}`)
    }
    function goHome() {
        navigate('/')
    }







    return (
        <div>

            {postModal && (
                <div>
                    {generatePostModal(postModalDisplay)}
                    <button onClick={() => goToNewRecipe(navigateNewId)}>Go To Recipe</button>
                    <button onClick={() => goHome()}>Home</button>
                </div>
            )}


            <h3>Please Review Your Recipe!</h3>

            <p>When you're ready, hit submit!</p>

            <button onClick={() => handleCreateRecipe()}>Create Your Recipe</button>

        </div>
    )
}

export default SubmitRecipe

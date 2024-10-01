import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import axios from 'axios'
import handleValueIsPresent from '../createFunctions/handleValueIsPresent'
import useAllCategory from '../createFunctions/allOfCategory'

const SubmitRecipe = ({ dataPackage }) => {
    const { newRecipeDetails, setNewRecipeDetails, subRecipePackage, ingredientPackage, stepPackage, tagPackage } = dataPackage

    const navigate = useNavigate()

    const [allRecipes, allRecipesStatus] = useAllCategory('/api/recipes/titleCheck')
    const [postModal, setPostModal] = useState(false) // modal toggle
    const [postModalDisplay, setPostModalDisplay] = useState('failure')
    const [navigateNewId, setNavigateNewId] = useState(0)




    function letsCheckValues(newObject) {
        const checkValueArray = Object.values(newObject)
        const isValue = handleValueIsPresent(...checkValueArray)
        if (!isValue) {
            alert('Check your Main Recipe Inputs')
            return false
        }

        // format trimming
        Object.entries(newObject).forEach(([key, value]) => {
            if (typeof value === 'string') {
                newObject[key] = value.trim();
            }
        })
        setNewRecipeDetails(newObject)

        // ! check for duplicate name
        const isDuplicate = allRecipes.map((recipe) => recipe.title.toLowerCase()).includes(newObject.newTitle.toLowerCase())
        console.log('isDuplicate', isDuplicate)
        if (isDuplicate) {
            alert('Your title is a duplicate!')
            return false
        }
        return true
    }

    const handleCreateRecipe = () => {
        const detailsAreValid = letsCheckValues(newRecipeDetails)
        if (detailsAreValid) {
            submitNewRecipe()
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







    const submitNewRecipe = async () => {

        // activate modal to loading
        setPostModal(true)
        setPostModalDisplay('loading')

        try {
            console.log('submitting new recipe', newRecipeDetails, subRecipePackage, ingredientPackage, stepPackage, tagPackage)
            const postResponse = await axios.post(`/api/recipes/newRecipe`, { newRecipeDetails, subRecipePackage, ingredientPackage, stepPackage, tagPackage })

            if (postResponse.data.success) {
                console.log('success in recipe POST')
                setPostModalDisplay('success')
            }

            // set your new recipe id
            setNavigateNewId(postResponse.data.newRecipeId)

            // todo RESET variables ? seems like it's resetting already

        } catch (error) {
            console.log('error in recipe POST')
            setPostModalDisplay('failure')
        }
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

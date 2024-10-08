import React, { useState, useEffect } from 'react'
import axios from 'axios'

// todo REFACTOR

export default function useRecipeDetails(recipeID, refresh) {
    const [theMainRecipe, setTheMainRecipe] = useState([])
    const [theSubRecipes, setTheSubRecipes] = useState([])
    const [theParentRecipes, setTheParentRecipes] = useState([])
    const [detailsStatus, setDetailsStatus] = useState('unloaded')

    useEffect(() => {
        fetchRecipeDetails(recipeID)
    }, [recipeID, refresh])

    async function fetchRecipeDetails(recipeID) {

        try {
            const results = await axios.get(`/api/recipes/details/${recipeID}`)
            const { mainRecipe, subRecipes, parentRecipes } = results.data

            // todo if recipe is does not exist, must return unloaded or error

            setTheMainRecipe(mainRecipe)
            setTheSubRecipes(subRecipes)
            setTheParentRecipes(parentRecipes)
            setDetailsStatus('loaded')

        } catch (error) {
            console.log('error in fetching details', error)
            setDetailsStatus('error')
            // todo alert user
        }
    }

    
    return { theMainRecipe, theSubRecipes, theParentRecipes, detailsStatus }
}
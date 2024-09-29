import React, { useState, useEffect } from 'react'
import axios from 'axios'

// todo REFACTOR

export default function useRecipeDetails(recipeID) {
    console.log('in useRecipeDetails', recipeID)
    const [theMainRecipe, setTheMainRecipe] = useState([])
    const [theSubRecipes, setTheSubRecipes] = useState([])
    const [detailsStatus, setDetailsStatus] = useState('unloaded')

    useEffect(() => {
        fetchRecipeDetails(recipeID)
    }, [recipeID])

    async function fetchRecipeDetails(recipeID) {
        console.log('fetching details for', recipeID)

        try {
            const results = await axios.get(`/api/recipes/details/${recipeID}`)
            const { mainRecipe, subRecipes } = results.data
            // console.log('mainRecipe', mainRecipe)
            // console.log('subRecipes', subRecipes)
            setTheMainRecipe(mainRecipe)
            setTheSubRecipes(subRecipes)
            setDetailsStatus('loaded')

        } catch (error) {
            console.log('error in fetching details', error)
            setDetailsStatus('error')
            // todo alert user
        }
    }


    return { theMainRecipe, theSubRecipes, detailsStatus }
}
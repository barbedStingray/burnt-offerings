import { useState, useEffect } from 'react'
import axios from 'axios'

// todo REFACTOR

export default function useRecipeDetails(recipeID, refresh) {
    const [theMainRecipe, setTheMainRecipe] = useState([])
    const [theSubRecipes, setTheSubRecipes] = useState([])
    const [theParentRecipes, setTheParentRecipes] = useState([])
    const [isLoaded, setIsLoaded] = useState(false)
    const [detailStatus, setDetailStatus] = useState('')

    useEffect(() => {
        fetchRecipeDetails(recipeID)
    }, [recipeID, refresh])

    async function fetchRecipeDetails(recipeID) {
        setDetailStatus('loading')

        try {
            const results = await axios.get(`/api/recipes/details/${recipeID}`)
            const { mainRecipe, subRecipes, parentRecipes } = results.data

            setTheMainRecipe(mainRecipe)
            setTheSubRecipes(subRecipes)
            setTheParentRecipes(parentRecipes)
            setIsLoaded(true)
            setDetailStatus('')

        } catch (error) {
            console.log('error in fetching details', error)
            setIsLoaded(false)
            setDetailStatus('error')
        }
    }

    return { theMainRecipe, theSubRecipes, theParentRecipes, isLoaded, detailStatus }
}
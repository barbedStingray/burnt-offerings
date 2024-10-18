import { useState, useEffect } from 'react'
import axios from 'axios'

// ? Stretch Goal: Caching. Need to be able to clear it.

// const localCache = {}

const useFilteredRecipes = (keywords, page = 1) => {
    const [allRecipes, setAllRecipes] = useState([])
    const [totalPages, setTotalPages] = useState(1)
    const [totalRecipes, setTotalRecipes] = useState(0)
    const [recipeStatus, setRecipeStatus] = useState(false)
    const [apiSearching, setApiSearching] = useState('')
    const recipesPerPage = 10


    useEffect(() => {

        if (!keywords) {
            setAllRecipes([])
            setTotalPages(1)
            setTotalRecipes(0)
            setRecipeStatus(false)
            // setApiSearching('error') // error testing
            return // do not call api if no keywords exist
        }
        requestAllRecipes(keywords, page)

        // if (localCache[keywords] && localCache[keywords][page]) {
        //     console.log('found a cache!')
        //     const cachedData = localCache[keywords][page]
        //     setAllRecipes(cachedData.recipes)
        //     setTotalPages(cachedData.totalPages)
        //     setTotalRecipes(cachedData.totalRecipes)
        //     setRecipeStatus('loaded')
        // } else {
        //     requestAllRecipes(keywords, page)
        // }

    }, [keywords, page])


    async function requestAllRecipes(keywords, page) {
        setApiSearching('loading')

        try {
            const response = await axios.get('/api/recipes/all', {
                params: { keywords, offset: (page - 1) * recipesPerPage, limit: recipesPerPage },
            })

            const requestedRecipes = response.data.recipes
            const requestedTotalPages = response.data.totalPages
            const requestedTotalRecipes = response.data.totalRecipes

            setAllRecipes(requestedRecipes)
            setTotalPages(requestedTotalPages)
            setTotalRecipes(requestedTotalRecipes)
            setRecipeStatus(true)
            setApiSearching('')

            // // cache the results
            // if (!localCache[keywords]) {
            //     localCache[keywords] = {}
            // }
            // localCache[keywords][page] = {
            //     recipes: requestedRecipes,
            //     totalPages: requestedTotalPages,
            //     totalRecipes: requestedTotalRecipes
            // }

        } catch (error) {
            setRecipeStatus(false)
            setApiSearching('error')
        }
    }
    return { allRecipes, totalPages, totalRecipes, recipeStatus, apiSearching }
}
export default useFilteredRecipes
import { useState, useEffect } from 'react'
import axios from 'axios'

const localCache = {}
const recipesPerPage = 8

const useFilteredRecipes = (keywords, page = 1) => {
    const [allRecipes, setAllRecipes] = useState([])
    const [loadingStatus, setLoadingStatus] = useState('unloaded')
    const [totalPages, setTotalPages] = useState(1)
    const [totalRecipes, setTotalRecipes] = useState(0)

    
    useEffect(() => {

        if (!keywords) {
            console.log('no keywords!', keywords)
            setAllRecipes([])
            setTotalPages(1)
            setTotalRecipes(0)
            setLoadingStatus('loaded')
            return // do not call api if no keywords exist
        }

        if (localCache[keywords] && localCache[keywords][page]) {
            console.log('found a cache!')
            const cachedData = localCache[keywords][page]
            setAllRecipes(cachedData.recipes)
            setTotalPages(cachedData.totalPages)
            setTotalRecipes(cachedData.totalRecipes)
            setLoadingStatus('loaded')
        } else {
            requestAllRecipes(keywords, page)
        }
    }, [keywords, page])


    async function requestAllRecipes(keywords, page) {
        console.log('did not find a cache, going to api')
        setLoadingStatus('loading')

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
            setLoadingStatus('loaded')

            // cache the results
            if (!localCache[keywords]) {
                localCache[keywords] = {}
            }
            localCache[keywords][page] = {
                recipes: requestedRecipes,
                totalPages: requestedTotalPages,
                totalRecipes: requestedTotalRecipes
            }

        } catch (error) {
            console.log('error in loading all recipes', error)
            setLoadingStatus('error') // todo alert user to an error
        }
    }

    return { allRecipes, totalPages, totalRecipes, loadingStatus }
}


export default useFilteredRecipes
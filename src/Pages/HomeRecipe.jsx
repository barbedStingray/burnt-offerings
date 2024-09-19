import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'


const HomeRecipe = () => {

    const navigate = useNavigate()
    const debounceTimoutRef = useRef(null)

    const [keywords, setKeywords] = useState('')
    const [allRecipes, setAllRecipes] = useState([])
    const [loadingStatus, setLoadingStatus] = useState('unloaded')

    // pagination
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalRecipes, setTotalRecipes] = useState(0)
    const recipesPerPage = 5


    // todo make this it's own utility function eventually
    const fetchFilteredRecipes = async (keywords, page = 1) => {
        setLoadingStatus('loading')

        if (!keywords) {
            console.log('no keywords!', keywords)
            setAllRecipes([])
            setTotalPages(1)
            setTotalRecipes(0)
            setLoadingStatus('loaded')
            return // do not call api if no keywords exist
        }

        try {
            const response = await axios.get('/api/recipes/all', {
                params: { keywords, offset: (page - 1) * recipesPerPage, limit: recipesPerPage },
            })
            setAllRecipes(response.data.recipes)
            setTotalPages(response.data.totalPages)
            setTotalRecipes(response.data.totalRecipes)
            setLoadingStatus('loaded')
        } catch (error) {
            console.log('error in loading api recipes', error)
            setLoadingStatus('error') // todo alert user to an error
        }
    }

    const keywordChange = (keywords) => {
        setKeywords(keywords)
        setCurrentPage(1) // resets to 1st page on new keyword... ?

        if (debounceTimoutRef.current) {
            clearTimeout(debounceTimoutRef.current)
        }
        debounceTimoutRef.current = setTimeout(() => {
            fetchFilteredRecipes(keywords, 1) // always fetch from page 1 with new keyword
        }, 1000)
    }

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage)
        fetchFilteredRecipes(keywords, newPage) // fetch the recipes for the new page
    }



    // todo refactor buttons for singular button...
    function seeRecipeDetails(recipeID) {
        // console.log('viewing details of', recipeID)
        navigate(`/recipeDetails/${recipeID}`)
    }
    function goToCreateRecipePage(recipeID) {
        // console.log('viewing details of', recipeID)
        navigate(`/createRecipe`)
    }



    return (
        <div>
            <p>Burnt Offerings</p>

            {allRecipes.map((recipe, index) => (
                <p onClick={() => seeRecipeDetails(recipe.id)} key={index}>{recipe.title}</p>
            ))}

            <input
                type='text'
                placeholder='Search Keywords...'
                value={keywords}
                onChange={(e) => keywordChange(e.target.value)}
            />


            {/* pagination controls */}
            <div>
                <button
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                >Previous</button>
                <span>Page {currentPage} of {totalPages}</span>
                <button
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                >Next</button>
                <h1>{totalRecipes}</h1>
            </div>

            <button onClick={goToCreateRecipePage}>Create New Recipe</button>

        </div>
    )
}

export default HomeRecipe




// const [searchQuery, setSearchQuery] = useState('')
// const [filteredTags, setFilteredTags] = useState([])
// logic for filtering...
// const handleSearchChange = (e) => {
//     const query = e.target.value.toLowerCase()
//     setSearchQuery(query)

//     if (query.length === 0) {
//         setFilteredTags([])
//     } else {
//         const filtered = allTags.filter((tag) => tag.tags.toLowerCase().includes(query))
//         console.log('filter', filtered)

//         const sortedFiltered = filtered.sort((a, b) => {
//             console.log(a, b)
//             const startsWithQueryA = a.tags.toLowerCase().startsWith(query)
//             console.log('startsWithQueryA', startsWithQueryA)
//             const startsWithQueryB = b.tags.toLowerCase().startsWith(query)
//             console.log('startsWithQueryB', startsWithQueryB)
//             if (startsWithQueryA && !startsWithQueryB) return -1
//             if (!startsWithQueryA && startsWithQueryB) return 1
//             return 0
//         })
//         setFilteredTags(sortedFiltered)
//     }
// }

// HTML for dropdown searches
{/* <div>
                <h3>The Select Box</h3>
                <input 
                    type='text'
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder='search a tag...'
                />
                {filteredTags.length > 0 && (
                    <ul>
                        {filteredTags.map((tag) => (
                            <li key={tag.id}>{tag.tags}</li>
                        ))}
                    </ul>
                )}
            </div> */}
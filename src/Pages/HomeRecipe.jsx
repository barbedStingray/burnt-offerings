import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import Select from 'react-select'
import axios from 'axios'

import useAllCategory from '../utilities/allOfCategory';


const HomeRecipe = () => {

    const navigate = useNavigate()
    const debounceTimoutRef = useRef(null)

    const [keywords, setKeywords] = useState('')
    const [allRecipes, setAllRecipes] = useState([])
    const [loadingStatus, setLoadingStatus] = useState('unloaded')

    const fetchFilteredRecipes = async (keywords) => {
        console.log('fetching filtered recipes', keywords)
        setLoadingStatus('loading')

        try {
            const response = await axios.get('/api/recipes/all', {
                params: { keywords },
            })
            setAllRecipes(response.data)
            setLoadingStatus('loaded')
        } catch (error) {
            console.log('error in loading api recipes', error)
            setLoadingStatus('error') // todo alert user to an error
        }
    }

    const keywordChange = (keywords) => {
        console.log('the keyword has changed to', keywords)
        setKeywords(keywords)

        if (debounceTimoutRef.current) {
            clearTimeout(debounceTimoutRef.current)
        }
        debounceTimoutRef.current = setTimeout(() => {
            fetchFilteredRecipes(keywords)
        }, 1000)
    }










    function seeRecipeDetails(recipeID) {
        // console.log('viewing details of', recipeID)
        navigate(`/recipeDetails/${recipeID}`)
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
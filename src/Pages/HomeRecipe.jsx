import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Select from 'react-select'

import useAllCategory from '../utilities/allOfCategory';


const HomeRecipe = () => {

    const navigate = useNavigate()

    // lets make the call from recipes? 
    const [allRecipes, recipeStatus] = useAllCategory('/api/recipes/all')
    const [allTags, allTagsStatus] = useAllCategory('/api/tags/all')

    // todo function that takes you to the details
    // onClick
    // use recipe ID in url
    function seeRecipeDetails(recipeID) {
        // console.log('viewing details of', recipeID)
        navigate(`/recipeDetails/${recipeID}`)
    }

    const [searchQuery, setSearchQuery] = useState('')
    const [filteredTags, setFilteredTags] = useState([])



    const handleSearchChange = (e) => {
        const query = e.target.value.toLowerCase()
        setSearchQuery(query)

        if (query.length === 0) {
            setFilteredTags([])
        } else {
            const filtered = allTags.filter((tag) => tag.tags.toLowerCase().includes(query))
            console.log('filter', filtered)

            const sortedFiltered = filtered.sort((a, b) => {
                console.log(a, b)
                const startsWithQueryA = a.tags.toLowerCase().startsWith(query)
                console.log('startsWithQueryA', startsWithQueryA)
                const startsWithQueryB = b.tags.toLowerCase().startsWith(query)
                console.log('startsWithQueryB', startsWithQueryB)
                if (startsWithQueryA && !startsWithQueryB) return -1
                if (!startsWithQueryA && startsWithQueryB) return 1
                return 0
            })
            setFilteredTags(sortedFiltered)
        }
    }




    return (
        <div>
            <p>Burnt Offerings</p>

            {allRecipes.map((recipe, index) => (
                <p onClick={() => seeRecipeDetails(recipe.id)} key={index}>{recipe.title}</p>
            ))}

            <div>
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
            </div>
            {/* ! get this to add to the filter parameters */}

            <select>
                <option>Select One...</option>
                {allTags.map((tag) => (
                    <option key={tag.id}>{tag.tags}</option>
                ))}
            </select>


        </div>
    )
}

export default HomeRecipe

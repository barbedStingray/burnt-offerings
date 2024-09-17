import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Select from 'react-select'

import useAllCategory from '../utilities/allOfCategory';


const HomeRecipe = () => {

    const navigate = useNavigate()

    // lets make the call from recipes? 
    const [allRecipes, recipeStatus] = useAllCategory('/api/recipes/all')
    const [allTags, allTagsStatus] = useAllCategory('/api/tags/all')
    console.log('allTags', allTags)

    // todo function that takes you to the details
    // onClick
    // use recipe ID in url
    function seeRecipeDetails(recipeID) {
        console.log('viewing details of', recipeID)
        navigate(`/recipeDetails/${recipeID}`)
    }

    const countriesOptions = [
        {value: "india", label: "India"},
        {value: "USA", label: "USA"},
        {value: "New Zealand", label: "New Zealand"},
        {value: "morocco", label: "Morocco"},
        {value: "indonesia", label: "Indonesia"},
        {value: "bhutan", label: "Bhutan"},
    ]
    const [selectedOption, setSelectedOption] = useState()



    return (
        <div>
            <p>Burnt Offerings</p>

            {allRecipes.map((recipe, index) => (
                <p onClick={() => seeRecipeDetails(recipe.id)} key={index}>{recipe.title}</p>
            ))}

            <Select 
                options={countriesOptions}
                value={selectedOption}
            />

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

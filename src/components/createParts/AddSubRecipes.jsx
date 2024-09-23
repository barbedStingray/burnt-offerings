import React, { useState } from 'react'

import useAllCategory from '../../utilities/allOfCategory'
import handlePackingArray from '../../utilities/createHandlers/handlePackingArray'
import handleSearchDetailChange from '../../utilities/createHandlers/handleSearchDetailChange'


const AddSubRecipes = ({ dataPackage }) => {

    const [allowedSubRecipes, allowedSubRecipesStatus] = useAllCategory('/api/recipes/notParents')
    const [searchAttribute, setSearchAttribute] = useState('') // used for search existing tags/ingredients
    const [filteredTags, setFilteredTags] = useState([]) // dropdown filter logic
    const [newSubRecipeData, setNewSubRecipeData] = dataPackage
    const [newSubRecipe, setNewSubRecipe] = useState('')
    const [newSubRecipeObject, setNewSubRecipeObject] = useState({
        title: '',
        id: '',
    })


    const addNewSubRecipeToData = (e, newSubRecipe, newSubRecipeObject) => {
        e.preventDefault()
        console.log('newSubRecipe', newSubRecipe)

        // const newSubRecipeFormat = newSubRecipe.trim().charAt(0).toUpperCase() + newSubRecipe.trim().slice(1).toLowerCase();
        const matchedTag = allowedSubRecipes.find((item) => item.title === newSubRecipe)

        if (matchedTag) {
            const updatedSubRecipe = { ...newSubRecipeObject, title: matchedTag.tag, id: matchedTag.id }
            handlePackingArray(e, updatedSubRecipe, setNewSubRecipeObject, newSubRecipeData, setNewSubRecipeData, setFilteredTags)
        } else {
            const updatedSubRecipe = { ...newSubRecipeObject, title: newSubRecipe, id: 'zero' }
            handlePackingArray(e, updatedSubRecipe, setNewSubRecipeObject, newSubRecipeData, setNewSubRecipeData, setFilteredTags)
        }
        setNewSubRecipe('') // todo this needs to be somewhere else?
    }


    return (
        <div>
            <h3>Adding Sub Recipes</h3>
            <input
                name='title'
                type='text'
                placeholder='finding sub recipes'
                value={newSubRecipe}
                onChange={(e) => handleSearchDetailChange(e, setNewSubRecipe, allowedSubRecipes, setSearchAttribute, setFilteredTags)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        if (filteredTags.length > 0) {
                            const firstSub = filteredTags[0];
                            addNewSubRecipeToData(e, firstSub.title, newSubRecipeObject)
                            // handlePackingArray(e, firstSub, setNewSubRecipe, newSubRecipeData, setNewSubRecipeData, setFilteredTags); // Handle adding a new tag
                        } else {
                            console.log('something fishy!')
                            // todo send an alert to the user recipe does not exist
                        }
                    }
                }}
            >
            </input>

            {filteredTags.length > 0 && (
                <ul>
                    {filteredTags.map((item) => (
                        <li
                            key={item.id}
                            onClick={(e) => handlePackingArray(e, item, setNewSubRecipe, newSubRecipeData, setNewSubRecipeData, setFilteredTags)}
                        >{item[searchAttribute]}</li>
                    ))}
                </ul>
            )}
            {newSubRecipe}
            <br />
            {JSON.stringify(newSubRecipeData)}

        </div>
    )
}

export default AddSubRecipes

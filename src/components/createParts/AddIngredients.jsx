import React, { useState } from 'react'

import DetailInput from '../DetailInput'
import useAllCategory from '../../utilities/allOfCategory'
// import helper functions
import handlePackingArray from '../../utilities/createHandlers/handlePackingArray'
import handleSearchDetailChange from '../../utilities/createHandlers/handleSearchDetailChange'
import handleDetailChange from '../../utilities/createHandlers/handleDetailChange'

const AddIngredients = ({ dataPackage }) => {

    // ! todo FIX THIS - NOT WORKING

    const [allIngredients, allIngredientsStatus] = useAllCategory('/api/recipes/ingredients')
    const [searchAttribute, setSearchAttribute] = useState('') // used for search existing tags/ingredients
    const [filteredTags, setFilteredTags] = useState([]) // dropdown filter logic
    const [newIngredientsData, setNewIngredientsData] = dataPackage
    const [newIngredient, setNewIngredient] = useState('')
    const [theNewIngredient, setTheNewIngredient] = useState({
        ingredient: '',
        quantity: '',
        measurement: '',
        id: 'zero'
    })
    const ingredientDetailsInputs = [
        {
            name: 'ingredient',
            type: 'text',
            placeholder: 'looped New Ingredient...',
            required: true,
            maxLength: 50,
            minLength: 1,
            autoComplete: 'off',
            value: newIngredient,
            // ! This onchange is formatted incorrectly...
            onChange: (e) => handleSearchDetailChange(e, setNewIngredient, allIngredients, setSearchAttribute, setFilteredTags),
        },
        {
            name: 'quantity',
            type: 'number',
            placeholder: 'looped quantity...',
            required: true,
            maxLength: 10,
            minLength: 1,
            autoComplete: 'off',
            // value: newQuantity,
            value: theNewIngredient.quantity,
            onChange: (e) => handleDetailChange(e, theNewIngredient, setTheNewIngredient)
        },
        {
            name: 'measurement',
            type: 'select',
            required: true,
            autoComplete: 'off',
            // value: newMeasurement,
            value: theNewIngredient.measurement,
            onChange: (e) => handleDetailChange(e, theNewIngredient, setTheNewIngredient)
        },
    ]

    // handles the clicking change when setting your variable inside OBJECTS...
    const handleClickDetailChange = (listItem, setSoloVariable, searchAttribute, setFilteredTags) => {
        setSoloVariable(listItem[searchAttribute])
        setFilteredTags([])
        setTheNewIngredient({ ...theNewIngredient, ingredient: listItem[searchAttribute], id: listItem.id })
    }


    const addIngredientButton = (e, newIngredient, theNewIngredient) => {
        e.preventDefault()

        const newIngredientFormat = newIngredient.trim().charAt(0).toUpperCase() + newIngredient.trim().slice(1).toLowerCase();
        const matchedIngredient = allIngredients.find((item) => item.ingredient === newIngredientFormat)

        if (matchedIngredient) {
            const updatedIngredient = { ...theNewIngredient, ingredient: matchedIngredient.ingredient, id: matchedIngredient.id }
            handlePackingArray(e, updatedIngredient, setTheNewIngredient, newIngredientsData, setNewIngredientsData, setFilteredTags)
        } else {
            const updatedIngredient = { ...theNewIngredient, ingredient: newIngredientFormat, id: 'zero' }
            handlePackingArray(e, updatedIngredient, setTheNewIngredient, newIngredientsData, setNewIngredientsData, setFilteredTags)
        }
        setNewIngredient('') // todo this needs to be somewhere else?
    }




    return (
        <div>
            <h3>Recipe Ingredients</h3>
            {ingredientDetailsInputs.map((input, i) => (
                <DetailInput key={i} inputDetails={input} />
            ))}
            <button onClick={(e) => addIngredientButton(e, newIngredient, theNewIngredient)}>Add Ingredient</button>

            {/* // todo enter is triggering the packing array... */}
            {filteredTags.length > 0 && (
                <ul>
                    {filteredTags.map((item) => ( // ! What happens if search query doesnt work? status?
                        <li
                            key={item.id}
                            onClick={() => handleClickDetailChange(item, setNewIngredient, searchAttribute, setFilteredTags)}
                        // todo set the ingredient on enter? ???
                        >{item[searchAttribute]}</li>
                    ))}
                </ul>
            )}
            <br />
            {newIngredient}
            {JSON.stringify(theNewIngredient)}
            <br />
            {JSON.stringify(newIngredientsData)}

        </div>
    )
}

export default AddIngredients

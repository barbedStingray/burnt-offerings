import React, { useState } from 'react'

import DetailInput from '../../components/DetailInput'
import useAllCategory from '../createFunctions/allOfCategory'
import handleSearchDetailChange from '../createFunctions/handleSearchDetailChange'
import handleDetailChange from '../createFunctions/handleDetailChange'
import submitNewObject from '../createFunctions/submitNewObject'

const CreateIngredients = ({ dataPackage }) => {
    const { ingredientPackage, setIngredientPackage } = dataPackage

    const [allIngredients, allIngredientsStatus] = useAllCategory('/api/recipes/ingredients')
    
    const [filteredList, setFilteredList] = useState([])
    const [searchAttribute, setSearchAttribute] = useState('')

    const [newIngredient, setNewIngredient] = useState({
        id: null,
        ingredient: '',
        quantity: '',
        measurement: '',
    })
    const initialTagState = { id: null, ingredient: '', quantity: '', measurement: '' }

    const ingredientDetailsInputs = [
        {
            name: 'quantity',
            type: 'number',
            placeholder: 'looped quantity...',
            required: true,
            maxLength: 10,
            minLength: 1,
            autoComplete: 'off',
            value: newIngredient.quantity,
            onChange: (e) => handleDetailChange(e, newIngredient, setNewIngredient)
        },
        {
            name: 'measurement',
            type: 'select',
            required: true,
            autoComplete: 'off',
            value: newIngredient.measurement,
            onChange: (e) => handleDetailChange(e, newIngredient, setNewIngredient)
        },
        {
            name: 'ingredient',
            type: 'text',
            placeholder: 'looped New Ingredient...',
            required: true,
            maxLength: 50,
            minLength: 1,
            autoComplete: 'off',
            value: newIngredient.ingredient,
            onChange: (e) => handleSearchDetailChange(e, newIngredient, setNewIngredient, allIngredients, setSearchAttribute, setFilteredList)

        },
    ]




    return (
        <div>
            <h3>Create INgredients</h3>

            <form name='ingredient' onSubmit={(e) => submitNewObject(e, newIngredient, setNewIngredient, allIngredients, ingredientPackage, setIngredientPackage, initialTagState, setFilteredList)}>

                {ingredientDetailsInputs.map((input, i) => (
                    <DetailInput key={i} inputDetails={input} />
                ))}
                {JSON.stringify(newIngredient)}


                {filteredList.length > 0 && (
                    <ul>
                        {filteredList.map((listItem) => (
                            <li
                            key={listItem.id}
                            onClick={(e) => {
                                const mergeIngredient = {
                                    ...listItem, quantity: newIngredient.quantity, measurement: newIngredient.measurement
                                }
                                submitNewObject(e, mergeIngredient, setNewIngredient, allIngredients, ingredientPackage, setIngredientPackage, initialTagState, setFilteredList)}
                            }
                            >{listItem[searchAttribute]}</li>
                        ))}
                    </ul>
                )}


                <button type='submit'>Add ingredient</button>
            </form>


        </div>
    )
}

export default CreateIngredients

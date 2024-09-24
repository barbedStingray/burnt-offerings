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
    const initialIngredientState = { id: null, ingredient: '', quantity: '', measurement: '' }

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
    ]

    /// this is where ben messes around with his structure...



    return (
        <div>
            <h3>Create INgredients</h3>

            <form name='ingredient' onSubmit={(e) => submitNewObject(e, newIngredient, setNewIngredient, allIngredients, ingredientPackage, setIngredientPackage, initialIngredientState, setFilteredList)}>

                {ingredientDetailsInputs.map((input, i) => (
                    <DetailInput key={i} inputDetails={input} />
                ))}
                {JSON.stringify(newIngredient)}

                <input // having this input outside the loop mattered when it came to handling events...
                    name='ingredient'
                    type='text'
                    placeholder='newIngredient'
                    required
                    maxLength={50}
                    minLength={1}
                    autoComplete='off'
                    value={newIngredient.ingredient}
                    // autoFocus
                    onChange={(e) => handleSearchDetailChange(e, newIngredient, setNewIngredient, allIngredients, setSearchAttribute, setFilteredList)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            const ingredientToSubmit = filteredList.length > 0 ? { ...filteredList[0], quantity: newIngredient.quantity, measurement: newIngredient.measurement } : newIngredient;
                            console.log('submitting', ingredientToSubmit)
                            submitNewObject(e, ingredientToSubmit, setNewIngredient, allIngredients, ingredientPackage, setIngredientPackage, initialIngredientState, setFilteredList)
                        }
                    }}
                >
                </input>


                {filteredList.length > 0 && (
                    <ul>
                        {filteredList.map((listItem) => (
                            <li
                                key={listItem.id}
                                onClick={(e) => {
                                    const mergeIngredient = {
                                        ...listItem, quantity: newIngredient.quantity, measurement: newIngredient.measurement
                                    }
                                    submitNewObject(e, mergeIngredient, setNewIngredient, allIngredients, ingredientPackage, setIngredientPackage, initialIngredientState, setFilteredList)
                                }
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


// const ingredientToSubmit = filteredList.length > 0 ? { ...filteredList[0], quantity: newIngredient.quantity, measurement: newIngredient.measurement } : newIngredient;
// console.log('submitting', ingredientToSubmit)

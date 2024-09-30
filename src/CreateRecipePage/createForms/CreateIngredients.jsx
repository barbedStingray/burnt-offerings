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
            className: 'createIngredientInput quantity',
            type: 'number',
            placeholder: 'Qty.',
            required: true,
            maxLength: 10,
            minLength: 1,
            autoComplete: 'off',
            value: newIngredient.quantity,
            onChange: (e) => handleDetailChange(e, newIngredient, setNewIngredient)
        },
        {
            name: 'measurement',
            className: 'createIngredientSelect',
            type: 'select',
            required: true,
            autoComplete: 'off',
            value: newIngredient.measurement,
            onChange: (e) => handleDetailChange(e, newIngredient, setNewIngredient)
        },
    ]

    /// this is where ben messes around with his structure...



    return (
        <div className='createIngredientFormPage'>
            <p className='createIngredientTitle'>Add Ingredients</p>

            <div className='createIngredientBox'>

                <form className='createIngredientForm' name='ingredient' onSubmit={(e) => submitNewObject(e, newIngredient, setNewIngredient, allIngredients, ingredientPackage, setIngredientPackage, initialIngredientState, setFilteredList)}>

                    <div className='createQuantityMeasurement'>
                        {ingredientDetailsInputs.map((input, i) => (
                            <DetailInput key={i} inputDetails={input} />
                        ))}
                        {/* // todo make your own modal for dropdown menu... */}
                    </div>

                    <input // having this input outside the loop mattered when it came to handling events...
                        name='ingredient'
                        className='createIngredientInput'
                        type='text'
                        placeholder='Add Ingredient'
                        required
                        maxLength={20}
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

                    <div className='filteredIngredientSearchContainer'>
                        {filteredList.length > 0 && (
                            <div className='createFilteredIngredientSearch'>
                                {filteredList.map((listItem) => (
                                    <div
                                        className='createIngredientMenuItem'
                                        key={listItem.id}
                                        onClick={(e) => {
                                            const mergeIngredient = {
                                                ...listItem, quantity: newIngredient.quantity, measurement: newIngredient.measurement
                                            }
                                            submitNewObject(e, mergeIngredient, setNewIngredient, allIngredients, ingredientPackage, setIngredientPackage, initialIngredientState, setFilteredList)
                                        }}
                                    >
                                        {listItem[searchAttribute]}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <button className='createIngredientButton' type='submit'>Add ingredient</button>


                    <div className='createIngredientDisplay'>
                            {ingredientPackage.map((ingredient) => (
                                <div className='createIngredientItem'>
                                    <p className='createIngredientQuantity'>99</p>
                                    <p className='createIngredientMeasurement'>Pinch</p>
                                    <p className='createIngredientIngredient'>{ingredient.ingredient}</p>
                                </div>
                            ))}
                    </div>
                </form>

            </div>



        </div>
    )
}

export default CreateIngredients


// const ingredientToSubmit = filteredList.length > 0 ? { ...filteredList[0], quantity: newIngredient.quantity, measurement: newIngredient.measurement } : newIngredient;
// console.log('submitting', ingredientToSubmit)

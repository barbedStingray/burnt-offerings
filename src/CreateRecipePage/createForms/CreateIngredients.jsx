import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

import DetailInput from '../../components/DetailInput'
import useAllCategory from '../createFunctions/allOfCategory'
import handleSearchDetailChange from '../createFunctions/handleSearchDetailChange'
import handleDetailChange from '../createFunctions/handleDetailChange'
import submitNewObject from '../createFunctions/submitNewObject'
import deletePackageItem from '../createFunctions/deletePackageItem'
import postOnlyType from '../../RecipeDetailsPage/detailFunctions/postOnlyType'
import inputLimits from '../../components/InputLimits'

const CreateIngredients = ({
    dataPackage,
    editPackage = { addMoreView: '', setAddMoreView: () => { }, recipeID: null },
}) => {

    const dispatch = useDispatch()
    const { displayId = null, ingredientPackage, setIngredientPackage } = dataPackage
    const { addMoreView, setAddMoreView, recipeID } = editPackage

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
            className: 'createFormInput',
            type: 'text',
            placeholder: 'Qty.',
            required: true,
            maxLength: inputLimits['quantity'],
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



    return (
        <div className='createFormPage'>
            <p className='createFormTitle'>Add Ingredients</p>

            <div className='createFormBox'>

                <form className='createInputForm' name='ingredient' onSubmit={(e) => submitNewObject(e, newIngredient, setNewIngredient, allIngredients, ingredientPackage, setIngredientPackage, initialIngredientState, setFilteredList)}>

                    <div className='inputIngredients'>
                        <div className='createQuantityMeasurement'>
                            {ingredientDetailsInputs.map((input, i) => (
                                <DetailInput key={i} inputDetails={input} />
                            ))}
                        </div>

                        <div className='createIngredientandAdd'>
                            <input // having this input outside the loop mattered when it came to handling events...
                                name='ingredient'
                                className='createFormInput'
                                type='text'
                                placeholder='Add Ingredient'
                                required
                                maxLength={inputLimits['ingredient']}
                                minLength={1}
                                autoComplete='off'
                                value={newIngredient.ingredient}
                                onChange={(e) => handleSearchDetailChange(e, newIngredient, setNewIngredient, allIngredients, setSearchAttribute, setFilteredList)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        const ingredientToSubmit = filteredList.length > 0 ? { ...filteredList[0], quantity: newIngredient.quantity, measurement: newIngredient.measurement } : newIngredient;
                                        submitNewObject(e, ingredientToSubmit, setNewIngredient, allIngredients, ingredientPackage, setIngredientPackage, initialIngredientState, setFilteredList)
                                    }
                                }}
                            >
                            </input>
                            <button className='basicButton' type='submit'>Add</button>
                        </div>
                    </div>


                    <div className='createFilteredContainer'>
                        {filteredList.length > 0 && (
                            <div className='createFilterSearch'>
                                {filteredList.map((listItem) => (
                                    <div
                                        className='createFilterItem'
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

                </form>

                <p>Added Ingredients</p>

                <div className='createRecipeDisplayItems'>
                    {ingredientPackage.map((ingredient, i) => (
                        <div
                            className='createListItem'
                            key={i}
                            onClick={() => deletePackageItem(i, ingredientPackage, setIngredientPackage)}
                        >
                            <p className='createIngredientQuantity'>{ingredient.quantity}</p>
                            <p className='createIngredientMeasurement'>{ingredient.measurement}</p>
                            <p className='createIngredientIngredient'>{ingredient.ingredient}</p>
                        </div>
                    ))}
                </div>

                {addMoreView?.length > 0 && (
                    <div className='addBtnGroup'>
                        <button className='basicButton' onClick={() => setAddMoreView('')}>Back</button>
                        <button className='fireButton medFire' onClick={() => postOnlyType('ingredients', displayId, ingredientPackage, setIngredientPackage, setAddMoreView, recipeID, dispatch)}></button>
                    </div>
                )}


            </div>
        </div>
    )
}

export default CreateIngredients


import React, { useState, useEffect } from 'react'
import useAllCategory from '../CreateRecipePage/createFunctions/allOfCategory'
import axios from 'axios'

import numberToMixed from '../RecipeDetailsPage/detailFunctions/conversions/numberToMixed'


import measurementOptions from './measurements'



const EditTheDetail = ({ category, editPackage }) => {
    const { type, detail, target_id } = category
    const { letsEdit, refresh, setRefresh, letsConvert, multiplier = 1 } = editPackage


    const [editStatus, setEditStatus] = useState(false)
    const [newEdit, setNewEdit] = useState(detail)
    const [allRecipes, allRecipesStatus] = useAllCategory('/api/recipes/titleCheck')
    const [allIngredients, allIngredientsStatus] = useAllCategory('/api/recipes/ingredients')


    // sync my newEdit values so leftovers are not displayed
    useEffect(() => {
        if (editStatus) {
            setNewEdit(detail)
        }
    }, [editStatus, detail])



    // put function
    async function putNewEdit(e, category, target_id, newEdit) {
        e.preventDefault()
        // console.log('putting edit', category, target_id)

        // check for value
        const isValue = newEdit !== ''
        // console.log('isValue', isValue)
        if (!isValue) return alert('No empty boxes, please')

        // format if necessary Trim all? 
        let formatDetail = newEdit.trim()
        // console.log('formatDetail', formatDetail)

        // check for duplicate
        if (category === 'title') {
            const filterTitleRecipes = allRecipes.filter((recipe) => recipe.title !== formatDetail)
            // console.log('filterTitleRecipes', filterTitleRecipes)
            const isDuplicate = filterTitleRecipes.map((recipe) => recipe.title.toLowerCase()).includes(formatDetail.toLowerCase())
            // console.log('isDuplicate', isDuplicate)
            if (isDuplicate) return alert('your title is a duplicate')
        }

        if (category === 'ingredient') {
            console.log('this is an ingredient', formatDetail)
            // format
            formatDetail = formatDetail.trim().charAt(0).toUpperCase() + formatDetail.trim().slice(1).toLowerCase()
            console.log('formatDetail after ingredient', formatDetail)
            // check to see if it exists... if it does, set formatDetail to a number, if not leave it as a string
            let matchedId = allIngredients.find((item) => item['ingredient'] === formatDetail)
            console.log('matchedId', matchedId)
            if (matchedId) {
                formatDetail = matchedId.id
            }
            console.log('formatDetail', formatDetail)
        }

        // send to db
        try {
            // put new
            console.log('formatDetail', formatDetail, category, target_id)
            await axios.put(`/api/recipes/putDetail/${target_id}`, { category, formatDetail })

            // refresh
            setEditStatus(false)
            // ? I dont think this is needed...
            // setNewEdit(formatDetail)
            setRefresh(!refresh)
        } catch (error) {
            console.log('error client side PUT new', error)
            alert('something went wrong with PUT new')
        }
    }

    // ! steps to multiply the recipe
    // identify the quantity str
    // turn the quantity into a number - identify number
    // todo multiply the recipe accordingly...
    // turn the number back into quantity stirng
    // todo display new string



    // turns string quantity into whole number
    function mixedToNumber(qtyString) {
        // console.log('identifying number', qtyString)

        qtyString = qtyString.trim()
        const mixedNumberPattern = /(\d+)\s+(\d+)\/(\d+)/; // e.g., 2 1/3 Mixed number
        const fractionPattern = /(\d+)\/(\d+)/; // e.g., 1/3 Proper fractions

        function sortProperFraction(fractionString) {
            const [numerator, denominator] = fractionString.split('/').map(Number)
            return numerator / denominator
        }

        function sortMixedNumber(mixedString) {
            const parts = mixedString.split(' ')
            const wholePart = Number(parts[0])
            const fractionPart = parts[1]

            if (fractionPart) {
                const [numerator, denominator] = fractionPart.split('/').map(Number)
                return wholePart + (numerator / denominator)
            }
        }

        if (mixedNumberPattern.test(qtyString)) {
            return sortMixedNumber(qtyString)
        } else if (fractionPattern.test(qtyString)) {
            return sortProperFraction(qtyString)
        }

        const wholeNumber = Number(qtyString)
        return isNaN(wholeNumber) ? null : wholeNumber
    }




    function displayQuantity(details, multiplier) {

        // convert string to number
        const numericValue = mixedToNumber(details)
        console.log('numericValue', numericValue)
        if (numericValue === null) return details // if conversion fails, return og string

        console.log(multiplier)
        // multiply recipe
        const multiplyQuantity = numericValue * multiplier

        // convert back to mixed number string
        const mixedNumberString = numberToMixed(multiplyQuantity)
        return mixedNumberString
    }



    if (type === 'quantity') {
        // console.log('mixedToNumber', mixedToNumber('2 1/4'))
        // console.log('numberToMixed', numberToMixed('2.25'))
        // console.log('displayQuantity', displayQuantity('2.33', 1))
    }



    function multiplyRecipe() {
        console.log('multiplying recipe')
    }




    const renderInputField = (category) => {
        switch (category) {
            case 'steps':
            case 'description':
                return (
                    <textarea
                        value={newEdit}
                        onChange={(e) => setNewEdit(e.target.value)}
                        rows={4} // You can adjust the number of rows as needed
                    />
                )
            case 'measurement':
                return (
                    <select value={newEdit} onChange={(e) => setNewEdit(e.target.value)}>
                        {measurementOptions.map((measure, i) => (
                            <option key={i} value={measure}>{measure}</option>
                        ))}
                    </select>
                )
            default:
                return (
                    <input
                        type="text"
                        value={newEdit}
                        onChange={(e) => setNewEdit(e.target.value)}
                    />
                )
        }
    }





    return (
        <div>
            {editStatus ? (
                <form onSubmit={(e) => putNewEdit(e, type, target_id, newEdit)}>
                    {renderInputField(category)}
                    <button type='submit'>Save</button>
                    <button onClick={() => setEditStatus(false)}>Cancel</button>
                </form>
            ) : (
                <>
                    {type === 'quantity' ? (
                        <p onClick={letsEdit ? () => setEditStatus(true) : null}>{displayQuantity(detail, multiplier)}</p>
                    ) : (
                        <p onClick={letsEdit ? () => setEditStatus(true) : null}>{detail}</p>
                    )}
                </>
            )}

        </div>
    )
}

export default EditTheDetail

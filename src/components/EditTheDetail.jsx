import React, { useState, useEffect } from 'react'
import useAllCategory from '../CreateRecipePage/createFunctions/allOfCategory'
import axios from 'axios'

import checkDuplicateTitles from '../CreateRecipePage/createFunctions/checkDuplicateTitles'
import displayQuantity from '../RecipeDetailsPage/detailFunctions/conversions/displayQuantity'
import measurementOptions from './measurements'



const EditTheDetail = ({ category, editPackage }) => {
    const { type, detail, target_id } = category
    const { letsEdit, refresh, setRefresh, multiplier = 1 } = editPackage


    const [editStatus, setEditStatus] = useState(false)
    const [newEdit, setNewEdit] = useState(detail)
    const [allRecipes, allRecipesStatus] = useAllCategory('/api/recipes/titleCheck')
    const [allIngredients, allIngredientsStatus] = useAllCategory('/api/recipes/ingredients')
    const [crossedOff, setCrossedOff] = useState(false)

    // sync my newEdit values so leftovers are not displayed
    useEffect(() => {
        if (editStatus) {
            setNewEdit(detail)
        }
    }, [editStatus, detail])
    // close edits when not in edit mode
    useEffect(() => {
        if (letsEdit === false) {
            setEditStatus(false)
        }
    }, [letsEdit])


    // put function
    async function putNewEdit(e, category, target_id, newEdit) {
        e.preventDefault()

        // check for value
        const isValue = newEdit !== ''
        if (!isValue) return alert('No empty boxes, please')
        // format if necessary Trim all? 
        let formatDetail = newEdit.trim()
        // check for duplicate title
        if (category === 'title') {
            if (checkDuplicateTitles(formatDetail, allRecipes)) return
        }

        if (type === 'ingredient') {
            // format
            formatDetail = formatDetail.trim().charAt(0).toUpperCase() + formatDetail.trim().slice(1).toLowerCase()
            let matchedId = allIngredients.find((item) => item['ingredient'] === formatDetail)
            if (matchedId) {
                formatDetail = matchedId.id
            }
        }
        console.log('formatDetail', formatDetail)

        // send to db
        try {
            await axios.put(`/api/recipes/putDetail/${target_id}`, { category, formatDetail })
            setEditStatus(false)
            setRefresh(!refresh)
        } catch (error) {
            console.log('error client side PUT new', error)
            alert('something went wrong with PUT new')
        }
    }



    const renderInputField = (category) => {
        switch (category) {
            case 'instructions':
            case 'description':
                return (
                    <textarea
                        className='detailEditInput'
                        value={newEdit}
                        onChange={(e) => setNewEdit(e.target.value)}
                        rows={6} // You can adjust the number of rows as needed
                    />
                )
            case 'measurement':
                return (
                    <select
                        className='detailEditInput'
                        value={newEdit}
                        onChange={(e) => setNewEdit(e.target.value)}
                    >
                        {measurementOptions.map((measure, i) => (
                            <option key={i} value={measure}>{measure}</option>
                        ))}
                    </select>
                )
            default:
                return (
                    <input
                        className='detailEditInput'
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
                <div
                    className='editModal'
                    onClick={() => setEditStatus(false)}
                >
                    <div className='editDisplayModal'
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className='editHeader'>
                            <p>{type.toUpperCase()}</p>
                            <p>Edit</p>
                        </div>
                        <form
                            className={`editForm`}
                            onClick={(e) => e.stopPropagation()}
                            onSubmit={(e) => putNewEdit(e, type, target_id, newEdit)}
                        >
                            {renderInputField(type)}
                            <button className='fireButton medFire' type='submit'>Save</button>
                        </form>
                    </div>
                </div>
            ) : (
                // shown if not in edit mode && not clicked
                <>
                    {type === 'quantity' ? (
                        // this is shown if quantity is the type
                        <p onClick={letsEdit ? () => setEditStatus(true) : null}>{displayQuantity(detail, multiplier)}</p>
                    ) : (
                        <>
                            {/* // crossed off */}
                            {type === 'ingredient' || type === 'instructions' ? (
                                <>
                                    <p
                                        className={crossedOff ? 'crossedOff' : ''}
                                        onClick={letsEdit ? () => setEditStatus(true) : () => setCrossedOff(!crossedOff)}
                                    >
                                        {detail}
                                    </p>
                                </>
                            ) : (
                                // normal element
                                <p onClick={letsEdit ? () => setEditStatus(true) : null}>{detail}</p>
                            )}

                        </>
                    )}
                </>
            )}


        </div>
    )
}

export default EditTheDetail

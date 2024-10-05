import React, { useState, useEffect } from 'react'
import useAllCategory from '../CreateRecipePage/createFunctions/allOfCategory'
import axios from 'axios'



const EditTheDetail = ({ category, detail, target_id, letsEdit, refresh, setRefresh }) => {
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

        // todo send whole or decimals to the DB function 
        // todo finish quantity to db.


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
                        {/* Replace these options with your actual quantity options */}
                        <option value="">Select quantity</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        {/* Add more options as needed */}
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
                <form onSubmit={(e) => putNewEdit(e, category, target_id, newEdit)}>
                    {renderInputField(category)}
                    <button type='submit'>Save</button>
                    <button onClick={() => setEditStatus(false)}>Cancel</button>
                </form>
            ) : (
                <p onClick={letsEdit ? () => setEditStatus(true) : null}>{detail}</p>
            )}

        </div>
    )
}

export default EditTheDetail

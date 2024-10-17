import React from 'react'
import axios from 'axios'
import checkDuplicateTitles from '../CreateRecipePage/createFunctions/checkDuplicateTitles'
import useAllCategory from '../CreateRecipePage/createFunctions/allOfCategory'
import measurementOptions from './measurements'
import deleteSoloDetail from '../RecipeDetailsPage/detailFunctions/deleteSoloDetail'
import inputLimits from '../components/InputLimits'

const EditModal = ({ editPackage, refreshPackage }) => {
    const { editType, editId, newEdit, setNewEdit } = editPackage
    const { setEditModalView, refresh, setRefresh } = refreshPackage

    const [allRecipes, allRecipesStatus] = useAllCategory('/api/recipes/titleCheck')
    const [allIngredients, allIngredientsStatus] = useAllCategory('/api/recipes/ingredients')

    async function putNewEdit(e, type, target_id, newEdit) {
        e.preventDefault()

        // check for value
        const isValue = newEdit !== ''
        if (!isValue) return alert('No empty boxes, please')
        // format if necessary Trim all
        let formatDetail = newEdit.trim()
        // check for duplicate title
        if (type === 'title') {
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

        // send to db
        try {
            await axios.put(`/api/recipes/putDetail/${target_id}`, { type, formatDetail })
            setEditModalView(false)
            setRefresh(!refresh)
        } catch (error) {
            console.log('error client side PUT new', error)
            alert('something went wrong with PUT new')
        }
    }

    const generateEditInput = (editType) => {
        switch (editType) {
            case 'instructions':
            case 'description':
                return (
                    <textarea
                        className='detailEditInput'
                        value={newEdit}
                        maxLength={inputLimits[editType]}
                        onChange={(e) => setNewEdit(e.target.value)}
                        rows={6}
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
                        maxLength={inputLimits[editType]}
                        value={newEdit}
                        placeholder={`title`}
                        onChange={(e) => setNewEdit(e.target.value)}
                    />
                )
        }
    }


    return (
        <div onClick={() => setEditModalView(false)} className='modalFrame'>
            <div onClick={(e) => e.stopPropagation()} className='modalContents'>
                <p className='editHeader'>Edit the {editType}</p>
                <form className='editForm' onSubmit={(e) => putNewEdit(e, editType, editId, newEdit)}>
                    {generateEditInput(editType)}
                    <button className='fireButton medFire' type='submit'>Save</button>
                </form>
                {/* <button onClick={() => setEditModalView(false)}>Cancel</button> */}
                {(editType === 'ingredient' || editType === 'instructions') && (
                    <button className='deleteButton' onClick={() => deleteSoloDetail(editType, editId, refresh, setRefresh, setEditModalView)}>DELETE</button>
                )}
            </div>
        </div>
    )
}

export default EditModal

import React from 'react'


const DisplayIngredients = ({ editPackage, detailPackage }) => {
    const { letsEdit, openEditModal } = editPackage
    const { ingredients, multiplier = 1, setEditView } = detailPackage

    return (
        <div className='detailIngredients'>
        <p>Ingredients</p>
        {letsEdit && (
            <button className='fireButton addFire' onClick={() => setEditView('ingredient')}></button>
        )}
        {ingredients.map((ingredient, i) => (
            <div key={i}>
                <p onClick={letsEdit ? () => openEditModal('quantity', ingredient.quantity, ingredient.target_id) : null}>{ingredient.quantity}</p>
                <p onClick={letsEdit ? () => openEditModal('measurement', ingredient.measurement, ingredient.target_id) : null}>{ingredient.measurement}</p>
                <p onClick={letsEdit ? () => openEditModal('ingredient', ingredient.ingredient, ingredient.target_id) : null}>{ingredient.ingredient}</p>
            </div>
        ))}
    </div>
)
}

export default DisplayIngredients

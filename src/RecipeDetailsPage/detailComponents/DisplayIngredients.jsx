import React from 'react'
import conversionDisplay from '../detailFunctions/conversions/conversionDisplay'

const DisplayIngredients = ({ editPackage, detailPackage }) => {
    const { letsEdit, openEditModal } = editPackage
    const { ingredients, multiplier = 1, setAddMoreView } = detailPackage


    return (
        <div className='detailIngredients'>
            <p>Ingredients</p>
            {letsEdit && (
                <button className='fireButton addFire' onClick={() => setAddMoreView('ingredient')}></button>
            )}
            {ingredients.map((ingredient, i) => {
                const { quantity, measurement } = conversionDisplay(ingredient.quantity, ingredient.measurement, multiplier)

                return (
                    <div key={i}>
                        <p onClick={letsEdit ? () => openEditModal('quantity', ingredient.quantity, ingredient.target_id) : null}>{quantity}</p>
                        <p onClick={letsEdit ? () => openEditModal('measurement', ingredient.measurement, ingredient.target_id) : null}>{measurement}</p>
                        <p onClick={letsEdit ? () => openEditModal('ingredient', ingredient.ingredient, ingredient.target_id) : null}>{ingredient.ingredient}</p>
                    </div>)
            })}
        </div>
    )
}
export default DisplayIngredients

import React from 'react'
import conversionDisplay from '../detailFunctions/conversions/conversionDisplay'

const DisplayIngredients = ({ editPackage, detailPackage }) => {
    const { letsEdit, openEditModal } = editPackage
    const { ingredients, multiplier = 1, setAddMoreView } = detailPackage


    return (
        <div className='detailIngredients'>
            <div className='ingredientHeader'>
                <p>Ingredients</p>
                {letsEdit && (
                    <button className='fireButton addFire' onClick={() => setAddMoreView('ingredient')}></button>
                )}
            </div>
            <div className='displayRecipeIngredients'>
                {ingredients.map((ingredient, i) => {
                    const { quantity, measurement } = conversionDisplay(ingredient.quantity, ingredient.measurement, multiplier)

                    return (
                        <div className='displaySingleIngredient' key={i}>
                            <p className='displayQuantity' onClick={letsEdit ? () => openEditModal('quantity', ingredient.quantity, ingredient.target_id) : null}>{quantity}</p>
                            <p className='displayMeasurement' onClick={letsEdit ? () => openEditModal('measurement', ingredient.measurement, ingredient.target_id) : null}>{measurement}</p>
                            <p className='displayIngredient' onClick={letsEdit ? () => openEditModal('ingredient', ingredient.ingredient, ingredient.target_id) : null}>{ingredient.ingredient}</p>
                        </div>)
                })}
            </div>
        </div>
    )
}
export default DisplayIngredients

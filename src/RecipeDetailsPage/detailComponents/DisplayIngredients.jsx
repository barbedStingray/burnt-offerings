import React from 'react'
import EditTheDetail from '../../components/EditTheDetail'
import deleteSoloDetail from '../../components/deleteSoloDetail'


const DisplayIngredients = ({ editPackage, detailPackage }) => {
    const { letsEdit, refresh, setRefresh, multiplier = 1 } = editPackage
    const { ingredients, setEditView } = detailPackage

    return (
        <div className='detailIngredients'>
            <div className='detailSectionHeader'>
            <p>Ingredients</p>
            {letsEdit && (
                <button className='fireButton addFire' onClick={() => setEditView('ingredient')}></button>
            )}
            </div>
            <div className='displayRecipeIngredients'>
                {ingredients.map((ingredient, i) => (
                    <div
                        key={i}
                        className='displaySingleIngredient'
                    >
                        {letsEdit && <button className='deleteButton' onClick={letsEdit ? () => deleteSoloDetail('ingredient', ingredient.target_id, refresh, setRefresh) : null}>X</button>}

                        <div className='displayIngredientQuantity'>
                            <EditTheDetail
                                category={{ type: 'quantity', detail: ingredient.quantity, target_id: ingredient.target_id }}
                                editPackage={{ letsEdit, refresh, setRefresh, multiplier }}
                            />
                        </div>
                        <div className='displayIngredientMeasurement'>
                            <EditTheDetail
                                category={{ type: 'measurement', detail: ingredient.measurement, target_id: ingredient.target_id }}
                                editPackage={{ letsEdit, refresh, setRefresh }}
                            />

                        </div>
                        <div className='displayIngredientIngredient'>
                            <EditTheDetail
                                category={{ type: 'ingredient', detail: ingredient.ingredient, target_id: ingredient.target_id }}
                                editPackage={{ letsEdit, refresh, setRefresh }}
                            />
                        </div>

                    </div>
                ))}
            </div>

        </div>
    )
}

export default DisplayIngredients

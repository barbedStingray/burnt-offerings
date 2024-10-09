import React from 'react'
import EditTheDetail from '../../components/EditTheDetail'
import deleteSoloDetail from '../../components/deleteSoloDetail'


const DisplayIngredients = ({ editPackage, detailPackage }) => {
    const { letsEdit, refresh, setRefresh, multiplier = 1 } = editPackage
    const { ingredients, setEditView } = detailPackage

    return (
        <div>
            <p className='detailsDescriptionTitle'>Ingredients</p>
            <div className='displayRecipeIngredients'>
                {letsEdit && (
                    <button onClick={() => setEditView('ingredient')}>Add Ingredients</button>
                )}
                {ingredients.map((ingredient, i) => (
                    <div
                        key={i}
                        className='displaySingleIngredient'
                    >
                        {letsEdit && <button onClick={letsEdit ? () => deleteSoloDetail('ingredient', ingredient.target_id, refresh, setRefresh) : null}>DELETE ME</button>}

                        <EditTheDetail
                            category={{ type: 'quantity', detail: ingredient.quantity, target_id: ingredient.target_id }}
                            editPackage={{ letsEdit, refresh, setRefresh, multiplier }}
                        />
                        <EditTheDetail
                            category={{ type: 'measurement', detail: ingredient.measurement, target_id: ingredient.target_id }}
                            editPackage={{ letsEdit, refresh, setRefresh }}
                        />
                        <EditTheDetail
                            category={{ type: 'ingredient', detail: ingredient.ingredient, target_id: ingredient.target_id }}
                            editPackage={{ letsEdit, refresh, setRefresh }}
                        />
                    </div>
                ))}
            </div>

        </div>
    )
}

export default DisplayIngredients

import React from 'react'


const DisplaySteps = ({ editPackage, detailPackage }) => {
    const { letsEdit, openEditModal } = editPackage
    const { instructions, setEditView } = detailPackage


    return (
        <div className='detailSteps'>
            <p>Instructions</p>
            {letsEdit && (
                <button className='fireButton addFire' onClick={() => setEditView('step')}></button>
            )}
            {instructions.map((step, i) => (
                <div key={i} className='displayRecipeSteps'>
                    <p onClick={letsEdit ? () => openEditModal('step_number', step.step_number, step.step_id) : null}>{step.step_number}</p>
                    <p onClick={letsEdit ? () => openEditModal('instructions', step.instructions, step.step_id) : null}>{step.instructions}</p>
                </div>
            ))}
        </div>
    )
}

export default DisplaySteps

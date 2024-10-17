import React from 'react'


const DisplaySteps = ({ editPackage, detailPackage }) => {
    const { letsEdit, openEditModal } = editPackage
    const { instructions, setAddMoreView } = detailPackage

    

    return (
        <div className='detailSteps'>
            <div className='stepsHeader'>
                <p>Instructions</p>
                {letsEdit && (
                    <button className='fireButton addFire' onClick={() => setAddMoreView('step')}></button>
                )}
            </div>
            <div className='displayRecipeSteps'>
            {instructions.map((step, i) => (
                <div key={i} className='displaySingleStep'>
                    <p className='stepNumber' onClick={letsEdit ? () => openEditModal('step_number', step.step_number, step.step_id) : null}>{step.step_number}</p>
                    <p className='displayStep' onClick={letsEdit ? () => openEditModal('instructions', step.instructions, step.step_id) : null}>{step.instructions}</p>
                </div>
            ))}
            </div>
        </div>
    )
}

export default DisplaySteps

import React from 'react'
import EditTheDetail from '../../components/EditTheDetail'
import deleteSoloDetail from '../../components/deleteSoloDetail'


const DisplaySteps = ({ editPackage, detailPackage }) => {
    const { letsEdit, refresh, setRefresh } = editPackage
    const { instructions, setEditView } = detailPackage

    return (
        <div className='detailSteps'>
            <div className='detailSectionHeader'>
                <p>Instructions</p>
                {letsEdit && (
                    <button className='fireButton addFire' onClick={() => setEditView('step')}></button>
                )}
            </div>
            <div className='displayRecipeSteps'>
                {instructions.map((step, i) => (
                    <div key={i} className='displaySingleStep'>
                        {letsEdit && <button className='deleteButton' onClick={() => deleteSoloDetail('step', step.step_id, refresh, setRefresh)}>X</button>}


                        <div className='displayStepNumber'>
                            <EditTheDetail
                                category={{ type: 'step_number', detail: step.step_number, target_id: step.step_id }}
                                editPackage={{ letsEdit, refresh, setRefresh }}
                            />
                        </div>
                        <div className='displayStepStep'>
                            <EditTheDetail
                                category={{ type: 'instructions', detail: step.instructions, target_id: step.step_id }}
                                editPackage={{ letsEdit, refresh, setRefresh }}
                            />
                        </div>

                    </div>
                ))}
            </div>

        </div>
    )
}

export default DisplaySteps

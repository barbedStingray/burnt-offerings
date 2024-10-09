import React from 'react'
import EditTheDetail from '../../components/EditTheDetail'
import deleteSoloDetail from '../../components/deleteSoloDetail'


const DisplaySteps = ({ editPackage, detailPackage }) => {
    const { letsEdit, refresh, setRefresh } = editPackage
    const { instructions, setEditView } = detailPackage

    return (
        <div>
            <p className='detailsDescriptionTitle'>Instructions</p>
            <div className='displayRecipeSteps'>
                {letsEdit && (
                    <button onClick={() => setEditView('step')}>Add Step</button>
                )}
                {instructions.map((step, i) => (
                    <div key={i} className='displayStepItem'>
                        {letsEdit && <button onClick={() => deleteSoloDetail('step', step.step_id, refresh, setRefresh)}>DELETE ME</button>}

                        <EditTheDetail
                            category={{ type: 'step_number', detail: step.step_number, target_id: step.step_id }}
                            editPackage={{ letsEdit, refresh, setRefresh }}
                        />
                        <EditTheDetail
                            category={{ type: 'instructions', detail: step.instructions, target_id: step.step_id }}
                            editPackage={{ letsEdit, refresh, setRefresh }}
                        />
                    </div>
                ))}
            </div>

        </div>
    )
}

export default DisplaySteps

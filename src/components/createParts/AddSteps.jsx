import React, { useState } from 'react'

// import helper functions
import handlePackingArray from '../../utilities/createHandlers/handlePackingArray'


const AddSteps = ({ dataPackage }) => {

    const [newStep, setNewStep] = useState('')
    // ? turn filteredTags into a _ ?
    const [filteredTags, setFilteredTags] = useState([]) // dropdown filter logic
    const [newStepData, setNewStepData] = dataPackage

    return (
        <div>
            <h3>Recipe Steps</h3>
            <textarea
                name='instructions'
                placeholder='add a step...'
                maxLength={100}
                minLength={0}
                autoComplete='off'
                value={newStep}
                onChange={(e) => setNewStep(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault()
                        handlePackingArray(e, newStep, setNewStep, newStepData, setNewStepData, setFilteredTags)
                    }
                }}
            >

            </textarea>
            {newStep}
            <br />
            {JSON.stringify(newStepData)}
        </div>
    )
}

export default AddSteps

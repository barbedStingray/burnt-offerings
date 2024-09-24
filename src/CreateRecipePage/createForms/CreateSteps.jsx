import React, { useState } from 'react'

import handleDetailChange from '../createFunctions/handleDetailChange'
import submitNewObject from '../createFunctions/submitNewObject'


const CreateSteps = ({ dataPackage }) => {
    const { stepPackage, setStepPackage } = dataPackage

    const [newStep, setNewStep] = useState({ id: null, instructions: '' })
    const initialTagState = { id: null, instructions: '' }
    const [filteredList, setFilteredList] = useState([]) // dropdown logic
    const allSteps = [] // todo empty array to fulfill function -- replace a default in function


    return (
        <div>
            <h3>Create Steps</h3>

            <form name='instructions' onSubmit={(e) => submitNewObject(e, newStep, setNewStep, allSteps, stepPackage, setStepPackage, initialTagState, setFilteredList)}>
                <textarea
                    name='instructions'
                    placeholder='add a step...'
                    maxLength={100}
                    minLength={0}
                    autoComplete='off'
                    value={newStep.instructions}
                    onChange={(e) => handleDetailChange(e, newStep, setNewStep)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            submitNewObject(e, newStep, setNewStep, allSteps, stepPackage, setStepPackage, initialTagState, setFilteredList)
                        }
                    }}

                >
                </textarea>
                <button type='submit'>Add Step</button>

            </form>
            {JSON.stringify(newStep)}
            <br />



        </div>
    )
}

export default CreateSteps

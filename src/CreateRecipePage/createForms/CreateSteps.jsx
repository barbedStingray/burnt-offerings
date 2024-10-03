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
        <div className='createFormPage'>

            <p className='createFormTitle'>Add Instructions!</p>

            <div className='createFormBox'>
                <form className='createInputForm' name='instructions' onSubmit={(e) => submitNewObject(e, newStep, setNewStep, allSteps, stepPackage, setStepPackage, initialTagState, setFilteredList)}>
                    <textarea
                        name='instructions'
                        className='createFormTextArea'
                        placeholder='How do I make this?'
                        maxLength={200}
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
                    <button className='createAddButton' type='submit'>Add</button>
                </form>

                <p>Added Instructions</p>

                <div className='createRecipeDisplayItems'>
                    {stepPackage.map((step, i) => (
                        <div className='createListItem' key={i}>
                            <p className='createStepNumber'>{i + 1}</p>
                            <p className='createStepStep'>{step.instructions}</p>
                        </div>
                    ))}
                </div>

            </div>


        </div>
    )
}

export default CreateSteps

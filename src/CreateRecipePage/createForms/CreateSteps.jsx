import React, { useState } from 'react'
import axios from 'axios'

import handleDetailChange from '../createFunctions/handleDetailChange'
import submitNewObject from '../createFunctions/submitNewObject'
import deletePackageItem from '../createFunctions/deletePackageItem'

import postOnlyType from '../../components/postOnlyType'
import inputLimits from '../../components/InputLimits'

const CreateSteps = ({ 
    dataPackage,
    editPackage = { editView: '', setEditView: () => { }, refresh: false, setRefresh: () => { } },
}) => {
    
    const { displayId = null, stepPackage, setStepPackage } = dataPackage
    const { editView, setEditView, refresh, setRefresh } = editPackage


    const [newStep, setNewStep] = useState({ id: null, instructions: '' })
    const initialTagState = { id: null, instructions: '' }
    const [_, setFilteredList] = useState([]) // dropdown logic
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
                        maxLength={inputLimits['instructions']}
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
                        <div 
                        className='createListItem' 
                        key={i}
                        onClick={() => deletePackageItem(i, stepPackage, setStepPackage)}
                        >
                            <p className='createStepNumber'>{i + 1}</p>
                            <p className='createStepStep'>{step.instructions}</p>
                        </div>
                    ))}
                </div>

                {editView?.length > 0 && (
                    <div className='addBtnGroup'>
                        <button className='addBackButton' onClick={() => setEditView('')}>Back</button>
                        <button className='fireButton medFire' onClick={() => postOnlyType('steps', displayId, stepPackage, setStepPackage, refresh, setRefresh, setEditView)}>Submit Tags</button>
                    </div>
                )}


            </div>
        </div>
    )
}

export default CreateSteps

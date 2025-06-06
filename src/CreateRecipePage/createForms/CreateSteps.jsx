import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

import handleDetailChange from '../createFunctions/handleDetailChange'
import submitNewObject from '../createFunctions/submitNewObject'
import deletePackageItem from '../createFunctions/deletePackageItem'

import postOnlyType from '../../RecipeDetailsPage/detailFunctions/postOnlyType'
import inputLimits from '../../components/InputLimits'

const CreateSteps = ({ 
    dataPackage,
    editPackage = { addMoreView: '', setAddMoreView: () => { }, recipeID: null },
}) => {
    
    const { displayId = null, stepPackage, setStepPackage } = dataPackage
    const { addMoreView, setAddMoreView, recipeID } = editPackage
    const dispatch = useDispatch()


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
                    <button className='basicButton' type='submit'>Add</button>
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

                {addMoreView?.length > 0 && (
                    <div className='addBtnGroup'>
                        <button className='basicButton' onClick={() => setAddMoreView('')}>Back</button>
                        <button className='fireButton medFire' onClick={() => postOnlyType('steps', displayId, stepPackage, setStepPackage, setAddMoreView, recipeID, dispatch)}>Submit Steps</button>
                    </div>
                )}


            </div>
        </div>
    )
}

export default CreateSteps

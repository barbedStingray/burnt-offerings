

const stepDetailsInputs = (newStep, setNewStep, handleDetailChange) => [
    {
        name: 'instructions',
        type: 'textarea',
        placeholder: 'looped Instructions...',
        required: true,
        maxLength: 100,
        minLength: 1,
        autoComplete: 'off',   
        value: newStep.instructions,
        onChange: (e) => handleDetailChange(e, newStep, setNewStep)
    }
]
export default stepDetailsInputs
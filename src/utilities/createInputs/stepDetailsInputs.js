

const stepDetailsInputs = (newStep, setNewStep, handleDetailChange) => [
    {
        name: 'step_number',
        type: 'number',
        placeholder: 'looped Step Number...',
        required: true,
        maxLength: 5,
        minLength: 1,
        autoComplete: 'off',
        value: newStep.step_number,
        onChange: (e) => handleDetailChange(e, newStep, setNewStep)
    },
    {
        name: 'instructions',
        type: 'text',
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
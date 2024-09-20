
// wrap your inputs as a function because you are assuming DYNAMIC VALUES
// if you use it as a variable, it is only created ONCE
const newRecipeDetailInputs = (newRecipeDetails, setNewRecipeDetails, handleDetailChange) => [
    {
        name: 'title',
        type: 'text',
        placeholder: 'looped title...',
        required: true,
        maxLength: 40,
        minLength: 1,
        autoComplete: 'off',
        value: newRecipeDetails.title,
        onChange: (e) => handleDetailChange(e, newRecipeDetails, setNewRecipeDetails)
    },
    {
        name: 'description',
        type: 'textarea',
        placeholder: 'looped textArea...',
        required: false,
        maxLength: 300,
        minLength: 0,
        autoComplete: 'off',
        value: newRecipeDetails.description,
        onChange: (e) => handleDetailChange(e, newRecipeDetails, setNewRecipeDetails)
    },
    {
        name: 'prep_time',
        type: 'text',
        placeholder: 'looped prep_time...',
        required: false,
        maxLength: 10,
        minLength: 1,
        autoComplete: 'off',
        value: newRecipeDetails.prep_time,
        onChange: (e) => handleDetailChange(e, newRecipeDetails, setNewRecipeDetails)
    },
    {
        name: 'servings',
        type: 'number',
        placeholder: 'looped servings...',
        required: false,
        maxLength: 5,
        minLength: 1,
        autoComplete: 'off',
        value: newRecipeDetails.servings,
        onChange: (e) => handleDetailChange(e, newRecipeDetails, setNewRecipeDetails)
    },
]

export default newRecipeDetailInputs



const ingredientDetailsInputs = (
    newIngredient, setNewIngredient, handleDetailChange, handleSearchDetailChange,
    allIngredients, setSearchAttribute
) => [
    {
        name: 'ingredient',
        type: 'text',
        placeholder: 'looped New Ingredient...',
        required: true,
        maxLength: 50,
        minLength: 1,
        autoComplete: 'off',
        value: newIngredient.ingredient,
        onChange: (e) => handleSearchDetailChange(e, allIngredients, setSearchAttribute, newIngredient, setNewIngredient)
    },
    {
        name: 'quantity',
        type: 'number',
        placeholder: 'looped quantity...',
        required: true,
        maxLength: 10,
        minLength: 1,
        autoComplete: 'off',
        value: newIngredient.quantity,
        onChange: (e) => handleDetailChange(e, newIngredient, setNewIngredient)
    },
    {
        name: 'measurement',
        type: 'select',
        required: true,
        autoComplete: 'off',
        value: newIngredient.measurement,
        onChange: (e) => handleDetailChange(e, newIngredient, setNewIngredient)
    },
]


export default ingredientDetailsInputs
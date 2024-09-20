
const subRecipeDetailsInputs = (newSubRecipe, setNewSubRecipe, handleSearchDetailChange, allowedSubRecipes, setSearchAttribute) => [
    {
        name: 'title',
        type: 'text',
        placeholder: 'finding sub recipes...',
        required: false,
        maxLength: 100,
        minLength: 1,
        autoComplete: 'off',
        value: newSubRecipe.title,
        onChange: (e) => handleSearchDetailChange(e, allowedSubRecipes, setSearchAttribute, newSubRecipe, setNewSubRecipe)
    }
]
export default subRecipeDetailsInputs
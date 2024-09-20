

const tagDetailsInputs = (newTag, setNewTag, handleSearchDetailChange, allTags, setSearchAttribute) => [
    {
        name: 'tag',
        type: 'text',
        placeholder: 'looped a tag...',
        required: true,
        maxLength: 100,
        minLength: 1,
        autoComplete: 'off',
        value: newTag.tag,
        onChange: (e) => handleSearchDetailChange(e, allTags, setSearchAttribute, newTag, setNewTag)
    }
]

export default tagDetailsInputs
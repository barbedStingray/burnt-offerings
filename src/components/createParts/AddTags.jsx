import React, { useState } from 'react'

import useAllCategory from '../../utilities/allOfCategory'
// import helper functions
import handlePackingArray from '../../utilities/createHandlers/handlePackingArray'
import handleSearchDetailChange from '../../utilities/createHandlers/handleSearchDetailChange'

const AddTags = ({ dataPackage }) => {

    
    const [allTags, allTagsStatus] = useAllCategory('/api/recipes/tags')
    const [newTag, setNewTag] = useState('')
    const [searchAttribute, setSearchAttribute] = useState('') // used for search existing tags/ingredients
    const [filteredTags, setFilteredTags] = useState([]) // dropdown filter logic
    const [newTagData, setNewTagData] = dataPackage
    const [newTagObject, setNewTagObject] = useState({
        tag: '',
        id: '',
    })

    // todo refactor this and make it modular
    const addNewTagToData = (e, newTag, newTagObject) => {
        e.preventDefault()
        console.log('newTag', newTag)

        const newTagFormat = newTag.trim().charAt(0).toUpperCase() + newTag.trim().slice(1).toLowerCase();
        const matchedTag = allTags.find((item) => item.tag === newTagFormat)

        if (matchedTag) {
            const updatedTag = { ...newTagObject, tag: matchedTag.tag, id: matchedTag.id }
            handlePackingArray(e, updatedTag, setNewTagObject, newTagData, setNewTagData, setFilteredTags)
        } else {
            const updatedTag = { ...newTagObject, tag: newTagFormat, id: 'zero' }
            handlePackingArray(e, updatedTag, setNewTagObject, newTagData, setNewTagData, setFilteredTags)
        }
        setNewTag('') // todo this needs to be somewhere else?
    }







    return (
        <div>
            <h3>Add Tags</h3>
            <br />
            <input
                name='tag'
                type='text'
                placeholder='looped a tag...'
                required
                maxLength={25}
                minLength={1}
                autoComplete='off'
                value={newTag}
                onChange={(e) => handleSearchDetailChange(e, setNewTag, allTags, setSearchAttribute, setFilteredTags)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        if (filteredTags.length > 0) {
                            const firstTag = filteredTags[0];
                            addNewTagToData(e, firstTag.tag, newTagObject)
                            // handlePackingArray(e, firstTag, setNewTag, newTagData, setNewTagData, setFilteredTags); // Handle adding a new tag
                        } else {
                            console.log('New Variable going through...')
                            addNewTagToData(e, newTag, newTagObject)
                        }
                    }
                }}
            >
            </input>
            {newTag}
            <button onClick={(e) => addNewTagToData(e, newTag, newTagObject)}>Add Tag</button>
            {filteredTags.length > 0 && (
                <ul>
                    {filteredTags.map((listItem) => (
                        <li
                            key={listItem.id}
                            onClick={(e) => addNewTagToData(e, listItem.tag, newTagObject)}
                        >{listItem[searchAttribute]}</li>
                    ))}
                </ul>
            )}
            <br />
            {JSON.stringify(newTagData)}

        </div>
    )
}

export default AddTags

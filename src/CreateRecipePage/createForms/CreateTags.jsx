import React, { useState } from 'react'
import useAllCategory from '../createFunctions/allOfCategory'

// important functions
import submitNewObject from '../createFunctions/submitNewObject'
import handleSearchDetailChange from '../createFunctions/handleSearchDetailChange'


const CreateTags = ({ dataPackage }) => {
    const { tagPackage, setTagPackage } = dataPackage

    const [allTags, allTagsStatus] = useAllCategory('/api/recipes/tags')
    const [filteredList, setFilteredList] = useState([]) // dropdown logic
    const [searchAttribute, setSearchAttribute] = useState('') // dropdown logic

    // const [newTagData, setNewTagData] = useState([])
    const [newTag, setNewTag] = useState({ id: null, tag: '' })
    const initialTagState = { id: null, tag: '' }


    const tagPrompt = [
        'What kind of food is this?',
        'In what season would you make this?',
        'Add any other Tags you like!'
    ]
    const getTagPrompt = () => {
        if (tagPackage.length === 0) {
            return tagPrompt[0]
        } else if (tagPackage.length === 1) {
            return tagPrompt[1]
        } else {
            return tagPrompt[2]
        }
    }


    return (
        <div>

            <h3>Create Tags</h3>
            {getTagPrompt()}
            <form name='tag' onSubmit={(e) => submitNewObject(e, newTag, setNewTag, allTags, tagPackage, setTagPackage, initialTagState, setFilteredList)}>
                <input
                    name='tag'
                    type='text'
                    placeholder='looped a tag...'
                    required
                    maxLength={25}
                    minLength={1}
                    autoComplete='off'
                    value={newTag.tag}
                    onChange={(e) => handleSearchDetailChange(e, newTag, setNewTag, allTags, setSearchAttribute, setFilteredList)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            const tagToSubmit = filteredList.length > 0 ? filteredList[0] : newTag
                            submitNewObject(e, tagToSubmit, setNewTag, allTags, tagPackage, setTagPackage, initialTagState, setFilteredList)
                        }
                    }}
                >
                </input>
                <button type='submit'>Create Tag</button>

                {filteredList.length > 0 && (
                    <ul>
                        {filteredList.map((listItem) => (
                            <li
                                key={listItem.id}
                                onClick={(e) => submitNewObject(e, listItem, setNewTag, allTags, tagPackage, setTagPackage, initialTagState, setFilteredList)}
                            >{listItem[searchAttribute]}</li>
                        ))}
                    </ul>
                )}

                <br />
                {JSON.stringify(newTag)}

            </form>

            <button>Next Section</button>

        </div>
    )
}
export default CreateTags
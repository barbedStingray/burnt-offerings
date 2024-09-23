import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import useAllCategory from '../../utilities/allOfCategory'
import handleValueChecks from '../../utilities/createHandlers/handleValueChecks'
import handleDetailChange from '../../utilities/createHandlers/handleDetailChange'


const CreateTags = () => {

    const dispatch = useDispatch()

    const [allTags, allTagsStatus] = useAllCategory('/api/recipes/tags')
    const [filteredTags, setFilteredTags] = useState([]) // dropdown logic
    const [searchAttribute, setSearchAttribute] = useState('') // dropdown logic

    const [newTagData, setNewTagData] = useState([])
    const [newTag, setNewTag] = useState({ id: null, tag: '' })
    const initialTagState = { id: null, tag: '' }


    const tagPrompt = [
        'What kind of food is this?',
        'In what season would you make this?',
        'Add any other Tags you like!'
    ]
    const getTagPrompt = () => {
        if (newTagData.length === 0) {
            return tagPrompt[0]
        } else if (newTagData.length === 1) {
            return tagPrompt[1]
        } else {
            return tagPrompt[2]
        }
    }


    // ! creates the dropdown menu of options
    const handleSearchDetailChange = (e, object, setObjectFunction, searchList, setFilteredTags) => {
        console.log('handleSearchDetailChange', e.target.value)

        // ! define the attribute to search for and searchQuery
        const [id, attribute] = Object.keys(searchList[0]) // ! will not use id...
        console.log('attribute', attribute)
        setSearchAttribute(attribute)
        const searchQuery = e.target.value.toLowerCase()

        // ! Set the new Object
        handleDetailChange(e, object, setObjectFunction)

        // ! search and filter results
        if (searchQuery.length === 0) {
            setFilteredTags([])
        } else {
            const filtered = searchList.filter((item) => item[attribute].toLowerCase().includes(searchQuery))
            // console.log('filter', filtered)

            const sortedFiltered = filtered.sort((a, b) => {
                const startsWithQueryA = a[attribute].toLowerCase().startsWith(searchQuery)
                const startsWithQueryB = b[attribute].toLowerCase().startsWith(searchQuery)
                if (startsWithQueryA && !startsWithQueryB) return -1
                if (!startsWithQueryA && startsWithQueryB) return 1
                return 0
            })
            setFilteredTags(sortedFiltered)
        }
    }


    // ! push your OBJECT to the dataArray for DB
    function submitNewTag(e, newTag) {
        e.preventDefault()
        // const formName = e.target.value ? e.target.value : e.currentTarget.closest('form').name
        const formName = e.currentTarget.closest('form').name
        console.log('formName', formName)
        console.log('submitNewTag', newTag)
        const tagKeyword = newTag[formName]
        console.log('tagKeyword', tagKeyword)

        // ! pass your checks
        // todo ? Two-word tags?
        const checkValueArray = Object.values(newTag)
        console.log('checkValueArray', checkValueArray)
        const isValue = handleValueChecks(...checkValueArray)
        if (!isValue) return alert('please check your inputs!')

        // ! Bundler
        const tagKeywordFormat = tagKeyword.trim().charAt(0).toUpperCase() + tagKeyword.trim().slice(1).toLowerCase();
        // console.log('keywordFormat', tagKeywordFormat)
        let matchedTag = allTags.find((item) => item[formName] === tagKeywordFormat)
        // console.log('matchedTag', matchedTag)
        if (!matchedTag) {
            matchedTag = { ...newTag, [formName]: tagKeywordFormat, id: 'zero' }
        }
        // ! Update newTagData
        setNewTagData([...newTagData, matchedTag])
        // ! Clear Inputs
        setNewTag(initialTagState)
        setFilteredTags([])
    }


    // ! dispatch every time tagdata Changes
    useEffect(() => {
        if (newTagData.length > 0) {
            dispatchObject('CREATE_RECIPE_DETAILS', newTagData)
        }
    })
    function dispatchObject(reducer, updatedTags) {
        dispatch({ type: `${reducer}`, payload: updatedTags })
    }


    return (
        <div>

            <h3>Create Tags</h3>
            {getTagPrompt()}
            <form name='tag' onSubmit={(e) => submitNewTag(e, newTag)}>

                <input
                    name='tag'
                    type='text'
                    placeholder='looped a tag...'
                    required
                    maxLength={25}
                    minLength={1}
                    autoComplete='off'
                    value={newTag.tag}
                    onChange={(e) => handleSearchDetailChange(e, newTag, setNewTag, allTags, setFilteredTags)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            const tagToSubmit = filteredTags.length > 0 ? filteredTags[0] : newTag
                            submitNewTag(e, tagToSubmit)
                        }
                    }}
                >
                </input>
                <button type='submit'>Create Tag</button>

                {filteredTags.length > 0 && (
                    <ul>
                        {filteredTags.map((listItem) => (
                            <li
                                key={listItem.id}
                                onClick={(e) => submitNewTag(e, listItem)}
                            >{listItem[searchAttribute]}</li>
                        ))}
                    </ul>
                )}

                <br />
                {JSON.stringify(newTag)}
                <br />
                {JSON.stringify(newTagData)}


            </form>

            <button>Next Section</button>

        </div>
    )
}

export default CreateTags

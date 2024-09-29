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
        'What Type of Cuisine is it?',
        'What Season would you make it for?',
        'Add any other Tags you like!'
    ]
    const getTagPrompt = () => {
        if (tagPackage.length === 0) {
            return tagPrompt[0]
        } else if (tagPackage.length === 1) {
            return tagPrompt[1]
        } else if (tagPackage.length === 2) {
            return tagPrompt[2]
        } 
        else {
            return tagPrompt[3]
        }
    }

    // deletePackageItem
    function deletePackageItem(i, dataPackage, setDataPackage) { // needs to be modular
        console.log('tagindex', i)
        const newPackage = dataPackage.filter((_, index) => index !== i)
        console.log('newPackage', newPackage)
        setDataPackage(newPackage)
    }


    return (
        <div className='createTagsFormPage'>

            <p className='createTagTitle'>Add Your Tags</p>


            {/* //! 10 tag limit to start? */}
            <div className='createAddedTagsContainer'>
                <div className='createAddedTags'>
                    {tagPackage.map((tag, i) => (
                        <div 
                        onClick={() => deletePackageItem(i, tagPackage, setTagPackage)}
                        className='createAddedTag'
                        >
                            <p>{tag.tag} X</p>
                        </div>
                    ))}
                </div>
            </div>


            <div className='createTagPrompt'>
                <p>{getTagPrompt()}</p>
            </div>

            <form className='createTagInputForm' name='tag' onSubmit={(e) => submitNewObject(e, newTag, setNewTag, allTags, tagPackage, setTagPackage, initialTagState, setFilteredList)}>

                <input
                    className='createTagInput'
                    name='tag'
                    type='text'
                    placeholder='delicious...'
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
                            console.log('submitting', tagToSubmit)
                            submitNewObject(e, tagToSubmit, setNewTag, allTags, tagPackage, setTagPackage, initialTagState, setFilteredList)
                        }
                    }}
                >
                </input>

                <button className='createTagButton' type='submit'>Add Tag</button>

                <div className='filteredTagSearchContainer' >
                    {filteredList.length > 0 && (
                        <div className='createFilteredTagSearch'>
                            {filteredList.map((listItem) => (
                                <div
                                    className='createTagMenuItem'
                                    key={listItem.id}
                                    onClick={(e) => submitNewObject(e, listItem, setNewTag, allTags, tagPackage, setTagPackage, initialTagState, setFilteredList)}
                                >
                                    <p>{listItem[searchAttribute]}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </form>


        </div>
    )
}
export default CreateTags
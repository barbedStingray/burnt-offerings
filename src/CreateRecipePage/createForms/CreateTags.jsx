import React, { useState } from 'react'
import useAllCategory from '../createFunctions/allOfCategory'
import axios from 'axios'

// important functions
import submitNewObject from '../createFunctions/submitNewObject'
import handleSearchDetailChange from '../createFunctions/handleSearchDetailChange'
import deletePackageItem from '../createFunctions/deletePackageItem'


const CreateTags = ({
    dataPackage,
    // below - used in recipe edits
    editPackage = { tagModal: false, setTagModal: () => { } },
    detailsPackage = { recipeID: null, refresh: false, setRefresh: () => { } }
}) => {

    const { tagPackage, setTagPackage } = dataPackage
    const { tagModal, setTagModal } = editPackage
    const { recipeID, refresh, setRefresh } = detailsPackage


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

    async function postOnlyTags() {

        if (tagPackage.length === 0) {
            alert('You have not added any tags!')
            return
        }
        try {
            await axios.post(`/api/recipes/postOnlyTags`, { recipeID, tagPackage })
            // todo !! loading screen? error handling of duplicates?
            setTagPackage([])
            setRefresh(!refresh)
            setTagModal(false)
        } catch (error) {
            console.log('error client side postOnlyTags', error)
            alert('something went wrong posting only tags!')
        }
    }


    return (
        <div className='createFormPage'>

            <p className='createFormTitle'>Add Your Tags</p>

            <div className='createFormBox'>

                <form className='createInputForm' name='tag' onSubmit={(e) => submitNewObject(e, newTag, setNewTag, allTags, tagPackage, setTagPackage, initialTagState, setFilteredList)}>

                    <input
                        className='createFormInput'
                        name='tag'
                        type='text'
                        placeholder='tag here...'
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

                    <div className='createTagPrompt'>
                        <p>{getTagPrompt()}</p>
                    </div>

                    <button className='createAddButton' type='submit'>Add</button>

                    <div className='createFilteredContainer' >
                        {filteredList.length > 0 && (
                            <div className='createFilterSearch'>
                                {filteredList.map((listItem) => (
                                    <div
                                        className='createFilterItem'
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


                {tagModal && (
                    <div>
                        <button onClick={() => postOnlyTags()}>Submit Tags</button>
                        <button onClick={() => setTagModal(false)}>Cancel</button>
                    </div>
                )}


                <p>Tags</p>
                {/* //! 10 tag limit to start? */}
                <div className='createRecipeDisplayItems'>
                    <div className='createFilterSearch'>
                        {tagPackage.map((tag, i) => (
                            <div
                                key={i}
                                onClick={() => deletePackageItem(i, tagPackage, setTagPackage)}
                                className='createFilterItem'
                            >
                                <p>{tag.tag} X</p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>


        </div>
    )
}
export default CreateTags
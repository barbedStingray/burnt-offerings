import React, { useState } from 'react'
import useAllCategory from '../createFunctions/allOfCategory'
import axios from 'axios'

// important functions
import submitNewObject from '../createFunctions/submitNewObject'
import handleSearchDetailChange from '../createFunctions/handleSearchDetailChange'
import deletePackageItem from '../createFunctions/deletePackageItem'
import postOnlyType from '../../components/postOnlyType'
import getTagPrompt from '../createFunctions/getTagPrompt'


const CreateTags = ({
    dataPackage, // ? is recipeID undefined error?
    editPackage = { editView: '', setEditView: () => { }, refresh: false, setRefresh: () => { } },
}) => {

    const { displayId = null, tagPackage, setTagPackage } = dataPackage
    const { editView, setEditView, refresh, setRefresh } = editPackage
    const [allTags, allTagsStatus] = useAllCategory('/api/recipes/tags')
    const [filteredList, setFilteredList] = useState([]) // dropdown logic
    const [searchAttribute, setSearchAttribute] = useState('') // dropdown logic
    const [newTag, setNewTag] = useState({ id: null, tag: '' })
    const initialTagState = { id: null, tag: '' }



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
                        <p>{getTagPrompt(tagPackage)}</p>
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


                {editView?.length > 0 && (
                    <div>
                        <button onClick={() => postOnlyType('tags', displayId, tagPackage, setTagPackage, refresh, setRefresh, setEditView)}>Submit Tags</button>
                        <button onClick={() => setEditView('')}>Cancel</button>
                    </div>
                )}


                <p>Tags</p>
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
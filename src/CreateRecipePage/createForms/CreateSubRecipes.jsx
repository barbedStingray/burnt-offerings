import React, { useState } from 'react'

import useAllCategory from '../createFunctions/allOfCategory'
import handleSearchDetailChange from '../createFunctions/handleSearchDetailChange'
import submitNewObject from '../createFunctions/submitNewObject'
import deletePackageItem from '../createFunctions/deletePackageItem'
import postOnlyType from '../../components/postOnlyType'

const CreateSubRecipes = ({
  dataPackage,
  editPackage = { editView: '', setEditView: () => { }, refresh: false, setRefresh: () => { } },
}) => {

  const { displayId = null, subRecipePackage, setSubRecipePackage } = dataPackage
  const { editView, setEditView, refresh, setRefresh } = editPackage
  const [allowedSubRecipes, allowedSubRecipesStatus] = useAllCategory('/api/recipes/notParents')
  const [filteredList, setFilteredList] = useState([]) // dropdown logic
  const [searchAttribute, setSearchAttribute] = useState('') // dropdown logic
  const [newSubRecipe, setNewSubRecipe] = useState({ id: null, title: '' })
  const initialSubState = { id: null, title: '' }


  return (
    <div className='createFormPage'>

      <p className='createFormTitle'>Any Sub Recipes?</p>

      <div className='createFormBox'>

        <form className='createInputForm' name='title' onSubmit={(e) => submitNewObject(e, newSubRecipe, setNewSubRecipe, allowedSubRecipes, subRecipePackage, setSubRecipePackage, initialSubState, setFilteredList)}>

          <input
            name='title'
            className='createFormInput'
            type='text'
            placeholder='Find Sub Recipe'
            value={newSubRecipe.title}
            onChange={(e) => handleSearchDetailChange(e, newSubRecipe, setNewSubRecipe, allowedSubRecipes, setSearchAttribute, setFilteredList)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                const subToSubmit = filteredList.length > 0 ? filteredList[0] : null
                if (!subToSubmit) return alert('please choose an existing recipe!')
                submitNewObject(e, subToSubmit, setNewSubRecipe, allowedSubRecipes, subRecipePackage, setSubRecipePackage, initialSubState, setFilteredList)
              }
            }}
          >
          </input>

          <div className='createFilteredContainer'>
            {filteredList.length > 0 && (
              <div className='createFilterSearch'>
                {filteredList.map((listItem) => (
                  <div
                    className='createFilterItem'
                    key={listItem.id}
                    onClick={(e) => submitNewObject(e, listItem, setNewSubRecipe, allowedSubRecipes, subRecipePackage, setSubRecipePackage, initialSubState, setFilteredList)}
                  >
                    {listItem[searchAttribute]}
                  </div>
                ))}
              </div>
            )}
          </div>
        </form>


        {editView?.length > 0 && (
          <div>
            <button onClick={() => postOnlyType('subRecipes', displayId, subRecipePackage, setSubRecipePackage, refresh, setRefresh, setEditView)}>Submit subrecipes</button>
            <button onClick={() => setEditView('')}>Cancel</button>
          </div>
        )}


        <p>Sub Recipes</p>
        <div className='createRecipeDisplayItems'>
          {subRecipePackage.length === 0 ? (
            <p>No Recipes Added</p>
          ) : (
            <>
              {subRecipePackage.map((recipe, i) => (
                <p key={i} onClick={() => deletePackageItem(i, subRecipePackage, setSubRecipePackage)}>{recipe.title}</p>
              ))}
            </>
          )}
        </div>
      </div>

    </div>
  )
}

export default CreateSubRecipes

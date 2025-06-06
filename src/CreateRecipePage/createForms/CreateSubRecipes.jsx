import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

import useAllCategory from '../createFunctions/allOfCategory'
import handleSearchDetailChange from '../createFunctions/handleSearchDetailChange'
import submitNewObject from '../createFunctions/submitNewObject'
import deletePackageItem from '../createFunctions/deletePackageItem'
import postOnlyType from '../../RecipeDetailsPage/detailFunctions/postOnlyType'

const CreateSubRecipes = ({
  dataPackage,
  editPackage = { addMoreView: '', setAddMoreView: () => { }, recipeID: null },
}) => {

  const dispatch = useDispatch()
  const { displayId = null, subRecipePackage, setSubRecipePackage } = dataPackage
  const { addMoreView, setAddMoreView, recipeID } = editPackage
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

        {addMoreView?.length > 0 && (
          <div className='addBtnGroup'>
            <button className='basicButton' onClick={() => setAddMoreView('')}>Back</button>
            <button className='fireButton medFire' onClick={() => postOnlyType('subRecipes', displayId, subRecipePackage, setSubRecipePackage, setAddMoreView, recipeID, dispatch)}>Submit subrecipes</button>
          </div>
        )}

      </div>
    </div>
  )
}

export default CreateSubRecipes

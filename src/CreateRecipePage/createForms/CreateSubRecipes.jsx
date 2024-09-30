import React, { useState } from 'react'

import useAllCategory from '../createFunctions/allOfCategory'
import handleSearchDetailChange from '../createFunctions/handleSearchDetailChange'
import submitNewObject from '../createFunctions/submitNewObject'


const CreateSubRecipes = ({ dataPackage }) => {
  const { subRecipePackage, setSubRecipePackage } = dataPackage

  const [allowedSubRecipes, allowedSubRecipesStatus] = useAllCategory('/api/recipes/notParents')
  const [filteredList, setFilteredList] = useState([]) // dropdown logic
  const [searchAttribute, setSearchAttribute] = useState('') // dropdown logic

  // const [newTagData, setNewTagData] = useState([])
  const [newSubRecipe, setNewSubRecipe] = useState({ id: null, title: '' })
  const initialSubState = { id: null, title: '' }


  return (
    <div className='createSubRecipesFormPage'>

      <p className='createSubRecipesTitle'>Any Sub Recipes?</p>

      <div className='createSubRecipesBox'>

        <form className='createSubRecipeForm' name='title' onSubmit={(e) => submitNewObject(e, newSubRecipe, setNewSubRecipe, allowedSubRecipes, subRecipePackage, setSubRecipePackage, initialSubState, setFilteredList)}>

          <p>Added Sub Recipes</p>
          <div className='addedSubRecipesBox'>
            {subRecipePackage.length === 0 ? (
              <p>No Recipes Added</p>
            ) : (
              <>
                {subRecipePackage.map((recipe) => (
                  <p>{recipe.title}</p>
                ))}
              </>
            )}
          </div>

          <input
            name='title'
            className='createSubRecipeInput'
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

          <div className='filteredSubSearchContainer'>
            {filteredList.length > 0 && (
              <div className='filteredListSubRecipes'>
                {filteredList.map((listItem) => (
                  <div
                  className='filteredListSub'
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
      </div>



    </div>
  )
}

export default CreateSubRecipes

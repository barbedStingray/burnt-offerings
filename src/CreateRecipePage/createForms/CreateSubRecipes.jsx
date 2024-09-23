import React, { useState } from 'react'

import useAllCategory from '../../utilities/allOfCategory'
import handleSearchDetailChange from '../../utilities/createHandlers/handleSearchDetailChange'
import submitNewObject from '../../utilities/submitNewObject'


const CreateSubRecipes = ({ dataPackage }) => {
  const { subRecipePackage, setSubRecipePackage } = dataPackage

  const [allowedSubRecipes, allowedSubRecipesStatus] = useAllCategory('/api/recipes/notParents')
  const [filteredList, setFilteredList] = useState([]) // dropdown logic
  const [searchAttribute, setSearchAttribute] = useState('') // dropdown logic

  // const [newTagData, setNewTagData] = useState([])
  const [newSubRecipe, setNewSubRecipe] = useState({ id: null, title: '' })
  const initialSubState = { id: null, title: '' }


  return (
    <div>

      <h3>ADD SUB RECIPES</h3>

      <form name='title' onSubmit={(e) => submitNewObject(e, newSubRecipe, setNewSubRecipe, allowedSubRecipes, subRecipePackage, setSubRecipePackage, initialSubState, setFilteredList)}>
        
        <input
          name='title'
          type='text'
          placeholder='get sub recipe'
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

        {filteredList.length > 0 && (
          <ul>
            {filteredList.map((listItem) => (
              <li
                key={listItem.id}
                onClick={(e) => submitNewObject(e, listItem, setNewSubRecipe, allowedSubRecipes, subRecipePackage, setSubRecipePackage, initialSubState, setFilteredList)}
              >{listItem[searchAttribute]}</li>
            ))}
          </ul>
        )}
      </form>

      {JSON.stringify(newSubRecipe)}




    </div>
  )
}

export default CreateSubRecipes

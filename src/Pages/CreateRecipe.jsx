import React, { useState } from 'react'

import useAllCategory from '../utilities/allOfCategory'
import handlePackingArray from '../utilities/handlePackingArray'

import DetailInput from '../components/DetailInput' // input component
import newRecipeDetailInputs from '../utilities/createInputs/newRecipeDetailInputs'
import ingredientDetailsInputs from '../utilities/createInputs/ingredientDetailsInputs'
import stepDetailsInputs from '../utilities/createInputs/stepDetailsInputs'
import tagDetailsInputs from '../utilities/createInputs/tagDetailsInputs'
import subRecipeDetailsInputs from '../utilities/createInputs/subRecipeDetailsInputs'


// TODO REFACTOR


const CreateRecipe = () => {

    // db used items for quick fill
    const [allIngredients, allIngredientsStatus] = useAllCategory('/api/recipes/ingredients')
    const [allTags, allTagsStatus] = useAllCategory('/api/recipes/tags')
    const [allowedSubRecipes, allowedSubRecipesStatus] = useAllCategory('/api/recipes/notParents')
    const [searchAttribute, setSearchAttribute] = useState('') // used for search existing tags/ingredients
    // console.log('allowedSubRecipes', allowedSubRecipes)

    const [filteredTags, setFilteredTags] = useState([]) // dropdown filter logic

    // packages for DB
    const [newIngredientsData, setNewIngredientsData] = useState([])
    const [newStepData, setNewStepData] = useState([])
    const [newTagData, setNewTagData] = useState([])
    const [newSubRecipeData, setNewSubRecipeData] = useState([])
    // console.log('newIngredientsData', newIngredientsData)

    const [newRecipeDetails, setNewRecipeDetails] = useState({
        newTitle: '', // TODO create a check so no two titles are the same
        description: '',
        prep_time: '',
        servings: 'servings...',
        is_sub_recipe: false, // probably not needed
        is_parent_recipe: false, // returns true if sub recipes are added
        picture: null
    })
    // console.log('newRecipeDetails', newRecipeDetails)    
    const [newIngredient, setNewIngredient] = useState({
        ingredient: '',
        quantity: '',
        measurement: 0
    })
    // console.log('newIngredient', newIngredient)
    const [newStep, setNewStep] = useState({
        instructions: ''
    })
    // console.log('newStep', newStep)
    const [newTag, setNewTag] = useState({
        tag: ''
    })
    // console.log('newTag', newTag)
    const [newSubRecipe, setNewSubRecipe] = useState({
        title: ''
    })
    // console.log('newTag', newTag)


    const submitNewRecipe = (e) => {
        e.preventDefault()
        // console.log('submitting new recipe')
    }


    const handleDetailChange = (e, object, setFunction) => {
        const { name, value } = e.target
        setFunction({ ...object, [name]: value }) // setting it properly
    }


    // dropdown search and click logic
    // TODO refactor into it's own file
    const handleSearchDetailChange = (e, searchList, setSearchAttribute, newObject, setNewObject) => {
        const [id, attribute] = Object.keys(searchList[0]) // ? you could use the id later...
        setSearchAttribute(attribute)
        console.log('attribute', attribute)

        const searchQuery = e.target.value.toLowerCase()
        setNewObject({ ...newObject, [attribute]: e.target.value })

        if (searchQuery.length === 0) {
            setFilteredTags([])
        } else {
            const filtered = searchList.filter((item) => item[attribute].toLowerCase().includes(searchQuery))
            // console.log('filter', filtered)

            const sortedFiltered = filtered.sort((a, b) => {
                // console.log(a, b)
                const startsWithQueryA = a[attribute].toLowerCase().startsWith(searchQuery)
                // console.log('startsWithQueryA', startsWithQueryA)
                const startsWithQueryB = b[attribute].toLowerCase().startsWith(searchQuery)
                // console.log('startsWithQueryB', startsWithQueryB)
                if (startsWithQueryA && !startsWithQueryB) return -1
                if (!startsWithQueryA && startsWithQueryB) return 1
                return 0
            })
            setFilteredTags(sortedFiltered)
        }
    }
    const handleClickDetailChange = (variableName, newObject, setNewObject, searchAttribute) => {
        setNewObject({ ...newObject, [searchAttribute]: variableName })
        setFilteredTags([])
    }


    // todo Refactor
    const tagPrompt = [
        'What kind of food is this?',
        'In what season would you make this?',
        'Add any other Tags you like!'
    ]
    const getTagPrompt = () => {
        if (newTagData.length === 0) {
            return tagPrompt[0]
        } else if(newTagData.length === 1) {
            return tagPrompt[1]
        } else {
            return tagPrompt[2]
        }
    }


    return (
        <div>

            <h1>CREATE RECIPE</h1>

            <form onSubmit={submitNewRecipe}>


                <h3>Recipe Details</h3>
                {newRecipeDetailInputs(newRecipeDetails, setNewRecipeDetails, handleDetailChange).map((input, i) => (
                    <DetailInput key={i} inputDetails={input} />
                ))}
                <button disabled>Add Photo</button>
                {JSON.stringify(newRecipeDetails)}


                <br />
                <br />
                <br />


                <h3>Recipe Ingredients</h3>
                {ingredientDetailsInputs(newIngredient, setNewIngredient, handleDetailChange, handleSearchDetailChange, allIngredients, setSearchAttribute)
                    .map((input, i) => (
                        <DetailInput key={i} inputDetails={input} />
                    ))}
                {/* // todo CREATE COMPONENT  */}
                <button onClick={(e) => handlePackingArray(e, newIngredient, setNewIngredient, newIngredientsData, setNewIngredientsData)}>Add Ingredient</button>
                {filteredTags.length > 0 && searchAttribute === 'ingredient' && (
                    <ul>
                        {filteredTags.map((item) => (
                            <li
                                key={item.id}
                                onClick={() => handleClickDetailChange(item[searchAttribute], newIngredient, setNewIngredient, searchAttribute)}
                            >{item[searchAttribute]}</li>
                        ))}
                    </ul>
                )}
                <br />
                {JSON.stringify(newIngredientsData)}


                <br />
                <br />
                <br />


                <h3>Recipe Steps</h3>
                {stepDetailsInputs(newStep, setNewStep, handleDetailChange).map((input, i) => (
                    <DetailInput key={i} inputDetails={input} />
                ))}
                <button onClick={(e) => handlePackingArray(e, newStep, setNewStep, newStepData, setNewStepData)}>Add Step</button>
                <br />
                {JSON.stringify(newStepData)}



                <h3>Recipe Tags</h3>

                <p>{getTagPrompt()}</p>
                {tagDetailsInputs(newTag, setNewTag, handleSearchDetailChange, allTags, setSearchAttribute)
                    .map((input, i) => (
                        <DetailInput key={i} inputDetails={input} />
                    ))}
                <button onClick={(e) => handlePackingArray(e, newTag, setNewTag, newTagData, setNewTagData)}>Add Tag</button>
                <br />
                {/* // todo CREATE COMPONENT */}
                {filteredTags.length > 0 && searchAttribute === 'tag' && (
                    <ul>
                        {filteredTags.map((item) => (
                            <li
                                key={item.id}
                                onClick={() => handleClickDetailChange(item[searchAttribute], newTag, setNewTag, searchAttribute)}
                            >{item[searchAttribute]}</li>
                        ))}
                    </ul>
                )}
                {JSON.stringify(newTagData)}



                <h3>Recipe Add Sub Recipes</h3>
                {subRecipeDetailsInputs(newSubRecipe, setNewSubRecipe, handleSearchDetailChange, allowedSubRecipes, setSearchAttribute).map((input, i) => ( // TODO create a check so no two titles are the same
                    <DetailInput key={i} inputDetails={input} />
                ))}
                <button onClick={(e) => handlePackingArray(e, newSubRecipe, setNewSubRecipe, newSubRecipeData, setNewSubRecipeData)}>Add Sub Recipe</button>
                {/* // todo CREATE COMPONENT */}
                {filteredTags.length > 0 && searchAttribute === 'title' && (
                    <ul>
                        {filteredTags.map((item) => (
                            <li
                                key={item.id}
                                onClick={() => handleClickDetailChange(item[searchAttribute], newSubRecipe, setNewSubRecipe, searchAttribute)}
                            >{item[searchAttribute]}</li>
                        ))}
                    </ul>
                )}
                <br />
                {JSON.stringify(newSubRecipeData)}


                <br />
                <br />
                <br />


                <button onSubmit={submitNewRecipe}>Create Recipe</button>
            </form>

        </div>
    )
}

export default CreateRecipe




// ?React.memo/useMemo Quest? - callback to reduce re-renders?
// const handleDetailChange = useCallback((e, object, setFunction) => {
//     const { name, value } = e.target 
//     setFunction({ ...object, [name]: value })
// }, [])
// const recipeDetailInputs = useMemo(() => newRecipeDetailInputs(newRecipeDetails, setNewRecipeDetails, handleDetailChange), [newRecipeDetails, setNewRecipeDetails, handleDetailChange])

{/* // ?React.memo/useMemo Quest? - callback to reduce re-renders? */ }
{/* {recipeDetailInputs.map((input, i) => (
<DetailInput key={i} inputDetails={input} />
))} */}

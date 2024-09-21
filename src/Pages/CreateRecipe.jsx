import React, { useState } from 'react'

import useAllCategory from '../utilities/allOfCategory'
import handlePackingArray from '../utilities/handlePackingArray'

import DetailInput from '../components/DetailInput' // input component

// TODO REFACTOR single responsibilites

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
    const newRecipeDetailInputs = [
        {
            name: 'newTitle',
            type: 'text',
            placeholder: 'looped title...',
            required: true,
            maxLength: 40,
            minLength: 1,
            autoComplete: 'off',
            value: newRecipeDetails.title,
            onChange: (e) => handleDetailChange(e, newRecipeDetails, setNewRecipeDetails)
        },
        {
            name: 'description',
            type: 'textarea',
            placeholder: 'looped textArea...',
            required: false,
            maxLength: 300,
            minLength: 0,
            autoComplete: 'off',
            value: newRecipeDetails.description,
            onChange: (e) => handleDetailChange(e, newRecipeDetails, setNewRecipeDetails)
        },
        {
            name: 'prep_time',
            type: 'text',
            placeholder: 'looped prep_time...',
            required: false,
            maxLength: 10,
            minLength: 1,
            autoComplete: 'off',
            value: newRecipeDetails.prep_time,
            onChange: (e) => handleDetailChange(e, newRecipeDetails, setNewRecipeDetails)
        },
        {
            name: 'servings',
            type: 'number',
            placeholder: 'looped servings...',
            required: false,
            maxLength: 5,
            minLength: 1,
            autoComplete: 'off',
            value: newRecipeDetails.servings,
            onChange: (e) => handleDetailChange(e, newRecipeDetails, setNewRecipeDetails)
        },
    ]
    // console.log('newRecipeDetails', newRecipeDetails)    
    const [newIngredient, setNewIngredient] = useState({
        ingredient: '',
        quantity: '',
        measurement: 0
    })
    // console.log('newIngredient', newIngredient)
    const ingredientDetailsInputs = [
        {
            name: 'ingredient',
            type: 'text',
            placeholder: 'looped New Ingredient...',
            required: true,
            maxLength: 50,
            minLength: 1,
            autoComplete: 'off',
            value: newIngredient.ingredient,
            onChange: (e) => handleSearchDetailChange(e, allIngredients, setSearchAttribute, newIngredient, setNewIngredient, setFilteredTags)
        },
        {
            name: 'quantity',
            type: 'number',
            placeholder: 'looped quantity...',
            required: true,
            maxLength: 10,
            minLength: 1,
            autoComplete: 'off',
            value: newIngredient.quantity,
            onChange: (e) => handleDetailChange(e, newIngredient, setNewIngredient)
        },
        {
            name: 'measurement',
            type: 'select',
            required: true,
            autoComplete: 'off',
            value: newIngredient.measurement,
            onChange: (e) => handleDetailChange(e, newIngredient, setNewIngredient)
        },
    ]
    const [newStep, setNewStep] = useState({
        instructions: ''
    })
    const stepDetailsInputs = [
        {
            name: 'instructions',
            type: 'textarea',
            placeholder: 'looped Instructions...',
            required: true,
            maxLength: 100,
            minLength: 1,
            autoComplete: 'off',
            value: newStep.instructions,
            onChange: (e) => handleDetailChange(e, newStep, setNewStep)
        }
    ]
    // console.log('newStep', newStep)
    const [newTag, setNewTag] = useState({
        tag: ''
    })
    const tagDetailsInputs = [
        {
            name: 'tag',
            type: 'text',
            placeholder: 'looped a tag...',
            required: true,
            maxLength: 100,
            minLength: 1,
            autoComplete: 'off',
            value: newTag.tag,
            onChange: (e) => handleSearchDetailChange(e, allTags, setSearchAttribute, newTag, setNewTag, setFilteredTags)
        }
    ]
    // console.log('newTag', newTag)
    const [newSubRecipe, setNewSubRecipe] = useState({
        title: ''
    })
    const subRecipeDetailsInputs = [
        {
            name: 'title',
            type: 'text',
            placeholder: 'finding sub recipes...',
            required: false,
            maxLength: 100,
            minLength: 1,
            autoComplete: 'off',
            value: newSubRecipe.title,
            onChange: (e) => handleSearchDetailChange(e, allowedSubRecipes, setSearchAttribute, newSubRecipe, setNewSubRecipe, setFilteredTags)
        }
    ]
    // console.log('newSubRecipe', newSubRecipe)


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
    const handleSearchDetailChange = (e, searchList, setSearchAttribute, newObject, setNewObject, setFilteredTags) => {
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
        } else if (newTagData.length === 1) {
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
                {newRecipeDetailInputs.map((input, i) => (
                    <DetailInput key={i} inputDetails={input} />
                ))}
                <br />
                {JSON.stringify(newRecipeDetails)}


                <br />
                <br />


                <h3>Recipe Ingredients</h3>
                {ingredientDetailsInputs.map((input, i) => (
                    <DetailInput key={i} inputDetails={input} />
                ))}
                <button onClick={(e) => handlePackingArray(e, newIngredient, setNewIngredient, newIngredientsData, setNewIngredientsData)}>Add Ingredient</button>
                {filteredTags.length > 0 && searchAttribute === 'ingredient' && (
                    <ul>
                        {filteredTags.map((item) => ( // ! What happens if search query doesnt work? status?
                            <li
                                key={item.id}
                                onClick={() => handleClickDetailChange(item[searchAttribute], newIngredient, setNewIngredient, searchAttribute)}
                            >{item[searchAttribute]}</li>
                        ))}
                    </ul>
                )}
                <br />
                {JSON.stringify(newIngredient)}
                <br />
                {JSON.stringify(newIngredientsData)}

                <br />
                <br />


                <h3>Recipe Steps</h3>
                {stepDetailsInputs.map((input, i) => (
                    <DetailInput key={i} inputDetails={input} />
                ))}
                <button onClick={(e) => handlePackingArray(e, newStep, setNewStep, newStepData, setNewStepData)}>Add Step</button>
                <br />
                {JSON.stringify(newStep)}
                <br />
                {JSON.stringify(newStepData)}


                <br />
                <br />


                <h3>Recipe Tags</h3>
                <p>{getTagPrompt()}</p>
                {tagDetailsInputs.map((input, i) => (
                    <DetailInput key={i} inputDetails={input} />
                ))}
                <button onClick={(e) => handlePackingArray(e, newTag, setNewTag, newTagData, setNewTagData)}>Add Tag</button>
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
                <br />
                {JSON.stringify(newTag)}
                <br />
                {JSON.stringify(newTagData)}


                <br />
                <br />


                <h3>Recipe Add Sub Recipes</h3>
                {subRecipeDetailsInputs.map((input, i) => (
                    <DetailInput key={i} inputDetails={input} />
                ))}
                <button onClick={(e) => handlePackingArray(e, newSubRecipe, setNewSubRecipe, newSubRecipeData, setNewSubRecipeData)}>Add Sub Recipe</button>
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
                {JSON.stringify(newSubRecipe)}
                <br />
                {JSON.stringify(newSubRecipeData)}


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

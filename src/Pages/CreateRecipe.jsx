import React, { useCallback, useState } from 'react'

import useAllCategory from '../utilities/allOfCategory'
import handlePackingArray from '../utilities/handlePackingArray'

import DetailInput from '../components/DetailInput' // input component
import newRecipeDetailInputs from '../utilities/createInputs/newRecipeDetailInputs'
import ingredientDetailsInputs from '../utilities/createInputs/ingredientDetailsInputs'
import stepDetailsInputs from '../utilities/createInputs/stepDetailsInputs'
import tagDetailsInputs from '../utilities/createInputs/tagDetailsInputs'


// TODO REFACTOR

const CreateRecipe = () => {

    // db used items for quick fill
    const [allIngredients, allIngredientsStatus] = useAllCategory('/api/recipes/ingredients')
    const [allTags, allTagsStatus] = useAllCategory('/api/recipes/tags')
    const [searchAttribute, setSearchAttribute] = useState('') // used for search existing tags/ingredients


    // packages for DB
    const [newIngredientsData, setNewIngredientsData] = useState([])
    const [newStepData, setNewStepData] = useState([])
    const [newTagData, setNewTagData] = useState([])
    console.log('newIngredientsData', newIngredientsData)


    const [newRecipeDetails, setNewRecipeDetails] = useState({
        title: '',
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



    const submitNewRecipe = (e) => {
        e.preventDefault()
        console.log('submitting new recipe')
    }


    const [newStep, setNewStep] = useState({
        step_number: 'Step Number...',
        instructions: ''
    })
    console.log('newStep', newStep)
    const [newTag, setNewTag] = useState({
        tag: ''
    })
    console.log('newTag', newTag)




    // ?React.memo/useMemo Quest? - callback to reduce re-renders?
    // const handleDetailChange = useCallback((e, object, setFunction) => {
    //     const { name, value } = e.target 
    //     setFunction({ ...object, [name]: value })
    // }, [])
    // const recipeDetailInputs = useMemo(() => newRecipeDetailInputs(newRecipeDetails, setNewRecipeDetails, handleDetailChange), [newRecipeDetails, setNewRecipeDetails, handleDetailChange])


    const handleDetailChange = (e, object, setFunction) => {
        const { name, value } = e.target
        setFunction({ ...object, [name]: value }) // setting it properly
    }


    // dropdown search and click logic
    const [searchQuery, setSearchQuery] = useState('') // todo Why is SearchQuery not used?
    const [filteredTags, setFilteredTags] = useState([])
    const handleSearchDetailChange = (e, searchList, setSearchAttribute, newObject, setNewObject) => {
        const query = e.target.value.toLowerCase()
        setSearchQuery(query)

        const [id, attribute] = Object.keys(searchList[0]) // todo you could use the id later...
        setSearchAttribute(attribute)
        console.log('searchList', searchList)
        console.log('attribute', attribute)
        // todo store the dynamic attribute

        // todo update newObject with id and label...
        setNewObject({ ...newObject, [attribute]: e.target.value })


        if (query.length === 0) {
            setFilteredTags([])
        } else {
            const filtered = searchList.filter((item) => item[attribute].toLowerCase().includes(query))
            // console.log('filter', filtered)

            const sortedFiltered = filtered.sort((a, b) => {
                // console.log(a, b)
                const startsWithQueryA = a[attribute].toLowerCase().startsWith(query)
                // console.log('startsWithQueryA', startsWithQueryA)
                const startsWithQueryB = b[attribute].toLowerCase().startsWith(query)
                // console.log('startsWithQueryB', startsWithQueryB)
                if (startsWithQueryA && !startsWithQueryB) return -1
                if (!startsWithQueryA && startsWithQueryB) return 1
                return 0
            })
            setFilteredTags(sortedFiltered)
        }
    }
    const handleClickDetailChange = (variableName, newObject, setNewObject, searchAttribute) => {
        // set clicked ingredient

        setNewObject({ ...newObject, [searchAttribute]: variableName })
        // clear the search query and filtered tags
        setSearchQuery('')
        setFilteredTags([])
    }




    // todo you will have to run validation checks before the form is sent...
    return (
        <div>

            <h1>CREATE RECIPE</h1>

            <form onSubmit={submitNewRecipe}>


                <h3>Recipe Details</h3>
                {newRecipeDetailInputs(newRecipeDetails, setNewRecipeDetails, handleDetailChange).map((input, i) => (
                    <DetailInput key={i} inputDetails={input} />
                ))}
                {/* // ?React.memo/useMemo Quest? - callback to reduce re-renders? */}
                {/* {recipeDetailInputs.map((input, i) => (
                    <DetailInput key={i} inputDetails={input} />
                ))} */}
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
                    
                {/* // todo CREATE COMPONENT */}
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
                <button onClick={(e) => handlePackingArray(e, newIngredient, setNewIngredient, newIngredientsData, setNewIngredientsData)}>Add Ingredient</button>
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
                <input type='text' placeholder='search for non parent recipes' />

                <button onSubmit={submitNewRecipe}>Create Recipe</button>
            </form>

        </div>
    )
}

export default CreateRecipe

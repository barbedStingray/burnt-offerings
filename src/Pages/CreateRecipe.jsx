import React, { useState } from 'react'

import useAllCategory from '../utilities/allOfCategory'
import handlePackingArray from '../utilities/handlePackingArray'


// TODO REFACTOR

const CreateRecipe = () => {

    // db used items for quick fill
    const [allIngredients, allIngredientsStatus] = useAllCategory('/api/recipes/ingredients')
    const [allTags, allTagsStatus] = useAllCategory('/api/recipes/tags')
    // console.log('allTags', allTags)


    // packages for DB
    const [newIngredientsData, setNewIngredientsData] = useState([])
    const [newStepData, setNewStepData] = useState([])
    const [newTagData, setNewTagData] = useState([])

    const newRecipeDetailInputs = [
        {
            name: 'title',
            type: 'text',
            placeholder: 'Recipe Name...',
            required: 'required',
            maxLength: 40,
            minLength: 1,
            autoComplete: 'off'
        },
    ]



    const submitNewRecipe = (e) => {
        e.preventDefault()
        console.log('submitting new recipe')
    }



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
    const [newStep, setNewStep] = useState({
        step_number: 'Step Number...',
        instructions: ''
    })
    // console.log('newStep', newStep)
    const [newTag, setNewTag] = useState({
        tag: ''
    })
    console.log('newTag', newTag)




    // helper function to populate objects
    const handleDetailChange = (e, object, setFunction) => {
        const { name, value } = e.target
        setFunction({ ...object, [name]: value }) // setting it properly
    }



    // TODO ! dropdown menu for quick options
    // ? WHAT dropdowns for ingredients and tags (unsure of subRecipes...)
    const [searchQuery, setSearchQuery] = useState('')
    const [filteredTags, setFilteredTags] = useState([])

    // logic for filtering...

    // newIngredient, setNewIngredient
    // a.ingredient b.ingredient => a.tag b.tag

    const handleSearchDetailChange = (e, searchList) => { // takes the E, searchList...
        const query = e.target.value.toLowerCase()
        setSearchQuery(query)

        // update ingredient state with the type...
        setNewIngredient({ ...newIngredient, ingredient: e.target.value })

        const [ id, attribute ] = Object.keys(searchList[0]) // todo get this to return the attribute, use it later
        console.log('searchList', searchList)
        console.log('attribute', attribute)

        if (query.length === 0) {
            setFilteredTags([])
        } else {
            const filtered = searchList.filter((item) => item.ingredient.toLowerCase().includes(query))
            // console.log('filter', filtered)

            const sortedFiltered = filtered.sort((a, b) => {
                // console.log(a, b)
                const startsWithQueryA = a.ingredient.toLowerCase().startsWith(query)
                // console.log('startsWithQueryA', startsWithQueryA)
                const startsWithQueryB = b.ingredient.toLowerCase().startsWith(query)
                // console.log('startsWithQueryB', startsWithQueryB)
                if (startsWithQueryA && !startsWithQueryB) return -1
                if (!startsWithQueryA && startsWithQueryB) return 1
                return 0
            })
            setFilteredTags(sortedFiltered)
        }
    }

    const handleClickDetailChange = (ingredientName) => {
        // set clicked ingredient
        setNewIngredient({ ...newIngredient, ingredient: ingredientName })
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
                <input
                    name='title'
                    type='text'
                    value={newRecipeDetails.title}
                    onChange={(e) => handleDetailChange(e, newRecipeDetails, setNewRecipeDetails)}
                    placeholder='Recipe Name...'
                    required
                    maxLength={40}
                    minLength={1} // needed
                    autoComplete='off'
                // could add pattern for acceptable characters/numbers/symbols
                />
                <textarea
                    name='description'
                    type='text'
                    value={newRecipeDetails.description}
                    onChange={(e) => handleDetailChange(e, newRecipeDetails, setNewRecipeDetails)}
                    placeholder='Description...'
                    required
                    maxLength={300}
                    minLength={0} // needed?
                    autoComplete='off'
                // could add pattern for acceptable characters/numbers/symbols
                />

                <input
                    name='prep_time'
                    type='text'
                    value={newRecipeDetails.prep_time}
                    onChange={(e) => handleDetailChange(e, newRecipeDetails, setNewRecipeDetails)}
                    placeholder='Prep Time...'
                    required
                    maxLength={10}
                    minLength={1}
                    autoComplete='off'
                />
                <input
                    name='servings'
                    type='number'
                    value={newRecipeDetails.servings}
                    onChange={(e) => handleDetailChange(e, newRecipeDetails, setNewRecipeDetails)}
                    placeholder='Servings...'
                    required
                    maxLength={5}
                    minLength={1}
                    autoComplete='off'
                />
                <button disabled>Add Photo</button>


                <br />
                <br />
                <br />


                <h3>Recipe Ingredients</h3>

                <input
                    name='ingredient'
                    type='text'
                    value={newIngredient.ingredient}
                    onChange={(e) => handleSearchDetailChange(e, allIngredients)}
                    placeholder='Add New Ingredient...'
                    required
                    maxLength={50}
                    minLength={1}
                    autoComplete='off'
                />
                {filteredTags.length > 0 && (
                    <ul>
                        {filteredTags.map((item) => (
                            <li
                                key={item.id}
                                onClick={() => handleClickDetailChange(item.ingredient)}
                            >{item.ingredient}</li>
                        ))}
                    </ul>
                )}

                {/* <input
                    name='ingredient'
                    type='text'
                    value={newIngredient.ingredient} // ! not in object
                    onChange={(e) => handleDetailChange(e, newIngredient, setNewIngredient)} // ! not in object
                    placeholder='Add New Ingredient...'
                    required
                    maxLength={50}
                    minLength={1}
                    autoComplete='off'
                /> */}
                <input
                    name='quantity'
                    type='number'
                    value={newIngredient.quantity}
                    onChange={(e) => handleDetailChange(e, newIngredient, setNewIngredient)}
                    placeholder='Add quantity...'
                    required
                    maxLength={10}
                    minLength={1}
                    autoComplete='off'
                />
                <select
                    name='measurement'
                    value={newIngredient.measurement}
                    onChange={(e) => handleDetailChange(e, newIngredient, setNewIngredient)}
                    required
                >
                    <option value=''>Select One...</option>
                    <option value='1'>Tsp</option>
                    <option value='2'>Tbsp</option>
                </select>
                <button onClick={(e) => handlePackingArray(e, newIngredient, setNewIngredient, newIngredientsData, setNewIngredientsData)}>Add Ingredient</button>
                <br />
                {JSON.stringify(newIngredientsData)}


                <br />
                <br />
                <br />


                <h3>Recipe Steps</h3>
                <input
                    name='step_number'
                    type='number'
                    value={newStep.step_number}
                    onChange={(e) => handleDetailChange(e, newStep, setNewStep)}
                    placeholder='Step Number...'
                    required
                    maxLength={5}
                    minLength={1}
                    autoComplete='off'
                />
                <input
                    name='instructions'
                    type='text'
                    value={newStep.instructions}
                    onChange={(e) => handleDetailChange(e, newStep, setNewStep)}
                    placeholder='Instructions...'
                    required
                    maxLength={100}
                    minLength={1}
                    autoComplete='off'
                />
                <button onClick={(e) => handlePackingArray(e, newStep, setNewStep, newStepData, setNewStepData)}>Add Ingredient</button>
                <br />
                {JSON.stringify(newStepData)}





                <h3>Recipe Tags</h3>
                <input
                    name='tag'
                    type='text'
                    value={newTag.tag}
                    onChange={(e) => handleSearchDetailChange(e, allTags)}
                    placeholder='Add a tag...'
                    required
                    maxLength={100}
                    minLength={1}
                    autoComplete='off'
                />
                <button onClick={(e) => handlePackingArray(e, newTag, setNewTag, newTagData, setNewTagData)}>Add Tag</button>
                <br />
                {JSON.stringify(newTagData)}










                <h3>Recipe Add Sub Recipes</h3>
                <input type='text' placeholder='search for non parent recipes' />

                <button onSubmit={submitNewRecipe}>Create Recipe</button>
            </form>

        </div>
    )
}

export default CreateRecipe

import React, { useState } from 'react'

const CreateRecipe = () => {

    const [newRecipeDetails, setNewRecipeDetails] = useState({
        title: '',
        description: '',
        prep_time: '',
        servings: 0,
        is_sub_recipe: false, // probably not needed
        is_parent_recipe: false, // returns true if sub recipes are added
        picture: null
    })
    console.log('newRecipeDetails', newRecipeDetails)
    const newIngredients = []
    const newSteps = []
    const newTags = []
    const makeSubRecipes = []


    const submitNewRecipe = (e) => {
        e.preventDefault()
        console.log('submitting new recipe')
    }

    const handleDetailChange = (e) => {
        const { name, value } = e.target
        console.log('name, value', name, value)
        setNewRecipeDetails({ ...newRecipeDetails, [name]: value }) // setting it properly
    }




    // todo These will need to be forms...
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
                    onChange={(e) => handleDetailChange(e)}
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
                    onChange={(e) => handleDetailChange(e)}
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
                    onChange={(e) => handleDetailChange(e)}
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
                    onChange={(e) => handleDetailChange(e)}
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
                <input type='text' placeholder='ingredient...' />
                <select>
                    <option>Cups</option>
                    <option>Tsp</option>
                    <option>Tbsp</option>
                </select>
                <input type='number' placeholder='quantity'></input>

                <h3>Recipe Steps</h3>
                <input type='number' placeholder='step number...' />
                <input type='text' placeholder='instructions...' />

                <h3>Recipe Tags</h3>
                <input type='text' placeholder='add a tag...' />

                <h3>Recipe Add Sub Recipes</h3>
                <input type='text' placeholder='search for non parent recipes' />

                <button onSubmit={submitNewRecipe}>Create Recipe</button>
            </form>

        </div>
    )
}

export default CreateRecipe

import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'


import CreateDetails from './createForms/CreateDetails'
import CreateSubRecipes from './createForms/CreateSubRecipes'
import CreateIngredients from './createForms/CreateIngredients'
import CreateSteps from './createForms/CreateSteps'
import CreateTags from './createForms/CreateTags'


// TODO REFACTOR single responsibilites
// todo is redux useful anymore? 

const CreateNewRecipe = () => {


    // ! packages for DB
    const [tagPackage, setTagPackage] = useState([])
    const [newRecipeDetails, setNewRecipeDetails] = useState({
        newTitle: '',
        description: '',
        prep_time: '',
        servings: '',
        is_sub_recipe: false,
        is_parent_recipe: false,
        picture: null
    })
    const [subRecipePackage, setSubRecipePackage] = useState([])
    const [stepPackage, setStepPackage] = useState([])
    const [ingredientPackage, setIngredientPackage] = useState([])

    // ! packages for DB





    const submitNewRecipe = (e) => {
        e.preventDefault()
        // console.log('submitting new recipe')
    }


    function deleteTag(i, dataPackage, setDataPackage) { // needs to be modular
        console.log('tagindex', i)
        const newPackage = dataPackage.filter((_, index) => index !== i)
        console.log('newPackage', newPackage)
        setDataPackage(newPackage)
    }

    useEffect((e) => {
        console.log('checking if parent')
        if (subRecipePackage.length === 0) {
            setNewRecipeDetails({ ...newRecipeDetails, is_parent_recipe: false })
        } else {
            setNewRecipeDetails({ ...newRecipeDetails, is_parent_recipe: true })
        }
    }, [subRecipePackage])



    return (
        <div>

            <h1>CREATE RECIPE</h1>

            {/* // *** SUCCESS details */}
            <CreateDetails dataPackage={{ newRecipeDetails, setNewRecipeDetails }} />
            <p>DETAILS PACKAGE</p>
            <p>Title: {newRecipeDetails.newTitle}</p>
            <p>Description: {newRecipeDetails.description}</p>
            <p>Servings: {newRecipeDetails.servings}</p>
            <p>prep_time: {newRecipeDetails.prep_time}</p>
            <p>is_parent_recipe: {newRecipeDetails.is_parent_recipe ? 'true' : 'false'}</p>

            <CreateIngredients dataPackage={{ ingredientPackage, setIngredientPackage }} />
            {JSON.stringify(ingredientPackage)}

            <br />
            {/* // ** SUCCESS steps */}
            <CreateSteps dataPackage={{ stepPackage, setStepPackage }} />
            {JSON.stringify(stepPackage)}


            {/* // ** SUCCESS IN TAG PACKAGE ** */}
            <CreateTags dataPackage={{ tagPackage, setTagPackage }} />
            <p>TAG PACKAGE</p>
            {tagPackage.map((tag, i) => (
                <div key={i}>
                    <p>{tag.tag}</p>
                    <button onClick={() => deleteTag(i, tagPackage, setTagPackage)}>Delete</button>
                </div>
            ))}
            {JSON.stringify(tagPackage)}

            {/* // ** SUCCESS subRecipes */}
            <CreateSubRecipes dataPackage={{ subRecipePackage, setSubRecipePackage }} />
            {subRecipePackage.map((recipe, i) => (
                <div key={i}>
                    <p>{recipe.title}</p>
                    <button onClick={() => deleteTag(i, subRecipePackage, setSubRecipePackage)}>Delete</button>
                </div>
            ))}
            {JSON.stringify(subRecipePackage)}

            {/* <button onSubmit={submitNewRecipe}>Create Recipe</button> */}

        </div >
    )
}

export default CreateNewRecipe

import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import AddDetails from '../components/createParts/AddDetails'
import AddIngredients from '../components/createParts/AddIngredients'
import AddSteps from '../components/createParts/AddSteps'
import AddTags from '../components/createParts/AddTags'
import AddSubRecipes from '../components/createParts/AddSubRecipes'


import CreateDetails from './CreateDetails'
import CreateTags from './CreateTags'

// TODO REFACTOR single responsibilites
// todo is redux useful anymore? 

const CreateNewRecipe = () => {

    
    // ! packages for DB
    const [tagPackage, setTagPackage] = useState([])
    const [newRecipeDetails, setNewRecipeDetails] = useState({
        newTitle: '', // TODO create a check so no two titles are the same
        description: '',
        prep_time: '',
        servings: '',
        is_sub_recipe: false, // probably not needed
        is_parent_recipe: false, // todo returns true if sub recipes are added
        picture: null
    })


    // const [newIngredientsData, setNewIngredientsData] = useState([])
    // const [newStepData, setNewStepData] = useState([])
    // const [newSubRecipeData, setNewSubRecipeData] = useState([])
    // ! packages for DB



    const submitNewRecipe = (e) => {
        e.preventDefault()
        // console.log('submitting new recipe')
    }

    function deleteTag(i) {
        console.log('tagindex', i)
        const newPackage = tagPackage.filter((_, index) => index !== i)
        console.log('newPackage', newPackage)
        setTagPackage(newPackage)
    }


    return (
        <div>

            <h1>CREATE RECIPE</h1>

            {/* // *** SUCCESS details */}
            <CreateDetails dataPackage={{ newRecipeDetails, setNewRecipeDetails }}/> 
            <p>DETAILS PACKAGE</p>
            <p>Title: {newRecipeDetails.newTitle}</p>
            <p>Description: {newRecipeDetails.description}</p>
            <p>Servings: {newRecipeDetails.servings}</p>
            <p>prep_time: {newRecipeDetails.prep_time}</p>
            

            <br />

            {/* // ** SUCCESS IN TAG PACKAGE ** */}
            {/* <CreateTags dataPackage={{ tagPackage, setTagPackage }} />
            <p>TAG PACKAGE</p>
            {tagPackage.map((tag, i) => (
                <div key={i}>
                    <p>{tag.tag}</p>
                    <button onClick={() => deleteTag(i)}>Delete</button>
                </div>
            ))}
            {JSON.stringify(tagPackage)} */}

            {/* // todo subRecipes */}
            


            {/* <button onSubmit={submitNewRecipe}>Create Recipe</button> */}

        </div >
    )
}

export default CreateNewRecipe

import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import AddDetails from '../components/createParts/AddDetails'
import AddIngredients from '../components/createParts/AddIngredients'
import AddSteps from '../components/createParts/AddSteps'
import AddTags from '../components/createParts/AddTags'
import AddSubRecipes from '../components/createParts/AddSubRecipes'
import CreateTags from '../components/createParts/CreateTags'

// TODO REFACTOR single responsibilites

const CreateRecipe = () => {

    const createTagsData = useSelector((state) => state.createDetails)
    console.log(createTagsData)
    // ! packages for DB
    const [newRecipeDetails, setNewRecipeDetails] = useState({
        newTitle: '', // TODO create a check so no two titles are the same
        description: '',
        prep_time: '',
        servings: 'servings...',
        is_sub_recipe: false, // probably not needed
        is_parent_recipe: false, // returns true if sub recipes are added
        picture: null
    })
    const [newIngredientsData, setNewIngredientsData] = useState([])
    const [newStepData, setNewStepData] = useState([])
    const [newTagData, setNewTagData] = useState([])
    const [newSubRecipeData, setNewSubRecipeData] = useState([])
    // ! packages for DB



    const submitNewRecipe = (e) => {
        e.preventDefault()
        // console.log('submitting new recipe')
    }

    return (
        <div>

            <h1>CREATE RECIPE</h1>



                {/* <AddDetails dataPackage={[newRecipeDetails, setNewRecipeDetails]} />
                <br />
                <br />
                <AddIngredients dataPackage={[newIngredientsData, setNewIngredientsData]} />
                <br />
                <br />
                <AddSteps dataPackage={[newStepData, setNewStepData]} />
                <br />
                <br />
                <AddSubRecipes dataPackage={[newSubRecipeData, setNewSubRecipeData]} />
                <br />
                <br /> */}


                {/* // ! OLD INFO <AddTags dataPackage={[newTagData, setNewTagData]} /> */}

                <p>Reducer Data</p>
                {JSON.stringify(createTagsData)}
                <br />
                <br />
                <CreateTags /> 

                {/* <button onSubmit={submitNewRecipe}>Create Recipe</button> */}

        </div >
    )
}

export default CreateRecipe

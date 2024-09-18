import React, { useState } from 'react'
import { useParams } from 'react-router-dom'

import useRecipeDetails from '../utilities/recipeDetails'


const DetailsRecipe = () => {

    const { recipeID } = useParams()
    console.log('recipeID', recipeID)

    const { theMainRecipe, theSubRecipes, detailsStatus } = useRecipeDetails(recipeID)


    return (
        <div>
            <h1>MAIN RECIPE</h1>
            {JSON.stringify(theMainRecipe)}
            <h1>SUB RECIPEs</h1>
            {JSON.stringify(theSubRecipes)}
            <h1>STATUS</h1>
            {JSON.stringify(detailsStatus)}

        </div>
    )
}

export default DetailsRecipe

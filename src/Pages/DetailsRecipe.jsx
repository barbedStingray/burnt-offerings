import React, { useState } from 'react'
import { useParams } from 'react-router-dom'


const DetailsRecipe = () => {

    const { recipeID } = useParams()
    console.log('recipeID', recipeID)

    const [mainRecipe, setMainRecipe] = useState([])


    return (
        <div>
            <h1>DETAILS OF YOUR RECIPE</h1>

        </div>
    )
}

export default DetailsRecipe

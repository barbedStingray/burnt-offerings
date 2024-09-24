import React from 'react'
import axios from 'axios'

const SubmitRecipe = ({ dataPackage }) => {
    const { newRecipeDetails, subRecipePackage, ingredientPackage, stepPackage, tagPackage } = dataPackage

    // does this have to be async?
    const submitNewRecipe = async () => {
        // todo status display while waiting...
        // submit to dB! 
        try {
            console.log('submitting new recipe', newRecipeDetails, subRecipePackage, ingredientPackage, stepPackage, tagPackage)
            await axios.post(`/api/recipes/newRecipe`, { newRecipeDetails, subRecipePackage, ingredientPackage, stepPackage, tagPackage })
            console.log('success in recipe POST')
        } catch (error) {
            console.log('error in recipe POST')
        }


    }


  return (
    <div>
        <h3>Please Review Your Recipe!</h3>

        <p>When you're ready, hit submit!</p>

        <button onClick={() => submitNewRecipe()}>Create Your Recipe</button>

    </div>
  )
}

export default SubmitRecipe

import React from 'react'

const SubmitRecipe = ({ dataPackage }) => {
    const { newRecipeDetails, subRecipeDetails, ingredientPackage, stepPackage, tagPackage } = dataPackage

    // does this have to be async?
    const submitNewRecipe = () => {
        // todo status display while waiting...
        // submit to dB! 
        try {
            console.log('submitting new recipe', newRecipeDetails, subRecipeDetails, ingredientPackage, stepPackage, tagPackage)
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

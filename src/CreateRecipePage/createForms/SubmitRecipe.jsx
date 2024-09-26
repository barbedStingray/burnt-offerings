import React, { useState } from 'react'
import axios from 'axios'

const SubmitRecipe = ({ dataPackage }) => {
    const { newRecipeDetails, subRecipePackage, ingredientPackage, stepPackage, tagPackage } = dataPackage

    const [isRecipeCreated, setIsRecipeCreated] = useState(false)
    console.log('isRecipeCreated', isRecipeCreated)
    // does this have to be async? probably...
    

    
    
    
    
    
    const submitNewRecipe = async () => {
        // todo status display while waiting...
        // submit to dB! 
        
        try {
            console.log('submitting new recipe', newRecipeDetails, subRecipePackage, ingredientPackage, stepPackage, tagPackage)
            const postResponse = await axios.post(`/api/recipes/newRecipe`, { newRecipeDetails, subRecipePackage, ingredientPackage, stepPackage, tagPackage })
            
            if (postResponse.data.success) {
                console.log('success in recipe POST')
                setIsRecipeCreated(true)
            }

            // todo RESET variables
            // todo navigate??
            // todo steps don't return in order


        } catch (error) {
            console.log('error in recipe POST')
            setIsRecipeCreated(false)
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

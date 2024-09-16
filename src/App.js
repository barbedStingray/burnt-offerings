import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css';

function App() {

  function useAllRecipes() {
    console.log('loading all recipes customHOOK')
    const [allRecipes, setAllRecipes] = useState([])
    const [recipeStatus, setRecipeStatus] = useState('unloaded')

    useEffect(() => {
      requestAllRecipes()
    }, [])

    async function requestAllRecipes() {
      console.log('recipes API call')
      setAllRecipes([])
      setRecipeStatus('loading')

      try {
        const apiRecipes = await axios.get(`/api/recipes/all`)
        setAllRecipes(apiRecipes.data)
        setRecipeStatus('loaded')
      } catch (error) {
        console.log('error in loading api recipes')
      }
    }

    return [allRecipes, recipeStatus]
  }

  // lets make the call from recipes? 
  const [allRecipes, recipeStatus] = useAllRecipes()
  console.log('allRecipes', allRecipes)


  return (
    <div className="burnt-offerings">
      <p>Burnt Offerings</p>

      {allRecipes.map((recipe, index) => (
        <p key={index}>{recipe.recipe}</p>
      ))}

    </div>
  );
}

export default App;

import React from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import './App.css';

import RecipeHomePage from './RecipeHomePage/RecipeHomePage'
import RecipeDetailsPage from './RecipeDetailsPage/RecipeDetailsPage'
import CreateNewRecipe from './CreateRecipePage/CreateNewRecipe'

const localCache = {}

function App() {

  // clearing the cache
  function clearCache() {
    for (let key in localCache) {
      delete localCache[key]
    }
    console.log('cacheCleared')
  }



  return (
    <div className="burnt-offerings">
      <Routes>
        <Route path='/' element={<RecipeHomePage /> } />
        <Route path='/recipeDetails/:recipeID' element={<RecipeDetailsPage /> } />
        <Route path='/createRecipe' element={<CreateNewRecipe /> } />
        {/* include *** ROUTE */}
      </Routes>




    </div>
  );
}

export default App;

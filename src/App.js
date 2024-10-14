import React from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import './App.css';

import RecipeHomePage from './RecipeHomePage/RecipeHomePage'
import RecipeDetailsPage from './RecipeDetailsPage/RecipeDetailsPage'
import CreateNewRecipe from './CreateRecipePage/CreateNewRecipe'

const localCache = {}

function App() {


  return (
    <div className="burnt-offerings">
      <div className='quarterCircle'></div>
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

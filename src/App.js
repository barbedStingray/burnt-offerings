import React from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import './App.css';

import HomeRecipe from './Pages/HomeRecipe';
import DetailsRecipe from './Pages/DetailsRecipe';
import CreateRecipe from './Pages/CreateRecipe'


function App() {



  return (
    <div className="burnt-offerings">

      <Routes>
        <Route path='/' element={<HomeRecipe /> } />
        <Route path='/recipeDetails/:recipeID' element={<DetailsRecipe /> } />
        <Route path='/createRecipe' element={<CreateRecipe /> } />
        {/* include *** ROUTE */}
      </Routes>


    </div>
  );
}

export default App;

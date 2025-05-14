import React from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { motion as m, AnimatePresence } from 'framer-motion';
import './App.css';

import RecipeHomePage from './RecipeHomePage/RecipeHomePage'
import RecipeDetailsPage from './RecipeDetailsPage/RecipeDetailsPage'
import CreateNewRecipe from './CreateRecipePage/CreateNewRecipe'
import FourOhFour from './FourOhFour/FourOhFour';


function App() {

  const location = useLocation()

  return (
    <div className="burnt-offerings">
      <div className='quarterCircle'></div>

      <AnimatePresence mode='wait' initial={true}>
        <Routes location={location} key={location.pathname}>
          <Route path='/' element={<PageWrapper><RecipeHomePage /></PageWrapper>} />
          <Route path='/recipeDetails' element={<PageWrapper><RecipeDetailsPage /></PageWrapper>} />
          <Route path='/createRecipe' element={<PageWrapper><CreateNewRecipe /></PageWrapper>} />
          <Route path='/*' element={<PageWrapper><FourOhFour /></PageWrapper>} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}


function PageWrapper({ children }) {
  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6 }}
    >
      {children}
    </m.div>
  )
}


export default App;
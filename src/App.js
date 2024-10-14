import React from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import './App.css';

import RecipeHomePage from './RecipeHomePage/RecipeHomePage'
import RecipeDetailsPage from './RecipeDetailsPage/RecipeDetailsPage'
import CreateNewRecipe from './CreateRecipePage/CreateNewRecipe'
import { motion as m, AnimatePresence } from 'framer-motion';
import basicAnimation from './animations/basicAnimation';

const localCache = {}

function App() {

  const location = useLocation()


  const pageVariants = {
    initial: {
      opacity: 1,
      x: '-100vw', // Start from left off-screen
    },
    animate: {
      opacity: 1,
      x: 0, // End at the normal position
      transition: { duration: 0.5 },
    },
    exit: {
      opacity: 1,
      x: '100vw', // Exit to the right off-screen
      transition: { duration: 0.3 },
    },
  };



  return (
    <div className="burnt-offerings">
      <div className='quarterCircle'></div>
      <AnimatePresence mode='wait' initial={true}>
        <Routes location={location} key={location.pathname}>
          <Route path='/'
            element={
              <m.div
                initial='initial'
                animate="animate"
                exit="exit"
                variants={basicAnimation}
              >
                <RecipeHomePage />
              </m.div>
            } />
          <Route path='/recipeDetails/:recipeID' element={
            <m.div
              initial='initial'
              animate="animate"
              exit="exit"
              variants={basicAnimation}
            >
              <RecipeDetailsPage />
            </m.div>
          } />
          <Route path='/createRecipe' element={
            <m.div
              initial='initial'
              animate="animate"
              exit="exit"
              variants={basicAnimation}
            >
              <CreateNewRecipe />
            </m.div>
          } />
          {/* include *** ROUTE */}
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;

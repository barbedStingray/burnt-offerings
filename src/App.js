import React, { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { motion as m, AnimatePresence } from 'framer-motion';
import { setRootVariables } from './components/themes/setRootVars';
import './App.css';

import RecipeHomePage from './RecipeHomePage/RecipeHomePage'
import RecipeDetailsPage from './RecipeDetailsPage/RecipeDetailsPage'
import CreateNewRecipe from './CreateRecipePage/CreateNewRecipe'
import FourOhFour from './FourOhFour/FourOhFour';
import basicAnimation from './animations/basicAnimation';
import colorTheme from './components/themes/colorTheme';


function App() {

  const location = useLocation()

  const holidayThemes = {
    2: 'halloween',
    1: 'christmas',
  }


  // function getThemeByMonth() {
  //   const month = new Date().getMonth()
  //   const holiday = holidayThemes[month]
  //   return holiday ? colorTheme.colorSets[holiday] : colorTheme.colorSets.default
  // }

  // useEffect(() => {
  //   const selectedTheme = getThemeByMonth()
  //   setRootVariables(selectedTheme)
  // }, [])



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
          <Route path='*' element={
            <m.div
              initial='initial'
              animate="animate"
              exit="exit"
              variants={basicAnimation}
            >
              <FourOhFour />
            </m.div>
          } />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;

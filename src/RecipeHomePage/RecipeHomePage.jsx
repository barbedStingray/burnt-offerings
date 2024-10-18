import React, { useState, useEffect, useRef } from 'react'
import './RecipeHomePage.css'
import { motion as m, AnimatePresence } from 'framer-motion'




import useFilteredRecipes from './homeFunctions/useFilteredRecipes';
import useDebounce from './homeFunctions/useDebounce';
import HomeScreen from './homeComponents/HomeScreen';
import RecipeLink from './homeComponents/RecipeLink';
import handleApiStatus from './homeFunctions/handleApiStatus';
import PageBar from './homeComponents/PageBar';
import NavBar from '../components/NavBar'
import basicAnimation from '../animations/basicAnimation';
import parentAnimation from '../animations/parentAnimation';
import childAnimation from '../animations/childAnimation';

const RecipeHomePage = () => {

    const scrollToTopRef = useRef()
    const [keywords, setKeywords] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const bouncedKeywords = useDebounce(keywords, setCurrentPage)
    const { allRecipes, totalPages, totalRecipes, recipeStatus, apiSearching } = useFilteredRecipes(bouncedKeywords, currentPage)
    // local storage for my keywords
    // ? session vs local storage?
    useEffect(() => {
        const storedKeywords = sessionStorage.getItem('bouncedKeywords')
        if (storedKeywords) {
            setKeywords(storedKeywords)
        }
    }, [])
    useEffect(() => {
        if (bouncedKeywords) {
            sessionStorage.setItem('bouncedKeywords', bouncedKeywords)
        }
    }, [bouncedKeywords])



    return (
        <div className='homePage'>

            <NavBar navPackage={{ section: 'home' }} />

            {handleApiStatus(apiSearching)}

            {/* main display */}
            <div className='homeMainDisplay'>

                <div className='homeTopMain'>
                    <div className='homeTitleDisplay'><p>Mom's Kitchen</p></div>
                    <div className='homeSearchBar'>
                        <input
                            className='homeKeywordSearch'
                            type='text'
                            placeholder='Search Keywords...'
                            value={keywords}
                            onChange={(e) => setKeywords(e.target.value)}
                        />
                    </div>
                </div>

                <div className='bottomMain'>
                    <AnimatePresence initial={true} mode='wait'>
                        {recipeStatus ? (
                            <m.div className='recipeDisplay' ref={scrollToTopRef}
                                key="recipeDisplay"
                                variants={basicAnimation}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                            >
                                <AnimatePresence initial={true} mode='wait'>
                                    <m.div
                                        className='recipeMosaic'
                                        key={`recipeMosaic-${bouncedKeywords}-${currentPage}`}
                                        variants={parentAnimation}
                                        initial="initial"
                                        animate="animate"
                                        exit="exit"
                                    >
                                        <div className='homeSearchReturn'>
                                            <p>{totalRecipes}</p>
                                            <p className="homeRecipeLabel">Recipes</p>
                                        </div>
                                        {allRecipes.map((recipe) => (
                                            <m.div
                                                key={`${recipe.id}-${bouncedKeywords}`}
                                                className='recipeContainer'
                                                variants={childAnimation}
                                            >
                                                <RecipeLink key={recipe.id} recipe={recipe} />
                                            </m.div>
                                        ))}
                                    </m.div>
                                </AnimatePresence>
                            </m.div>
                        ) : (
                            <HomeScreen />
                        )}
                    </AnimatePresence>
                </div>
                <PageBar pageStatus={{ currentPage, setCurrentPage, totalPages, scrollToTopRef }} />
            </div>
        </div>
    )
}
export default RecipeHomePage
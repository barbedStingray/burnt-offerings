import React, { useState, useEffect, useRef } from 'react'
import './RecipeHomePage.css'

import useFilteredRecipes from './homeFunctions/useFilteredRecipes';
import useDebounce from './homeFunctions/useDebounce';
import HomeScreen from './homeComponents/HomeScreen';
import RecipeLink from './homeComponents/RecipeLink';
import handleApiStatus from './homeFunctions/handleApiStatus';
import PageBar from './homeComponents/PageBar';
import NavBar from '../components/NavBar'


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


    // Scroll to top whenever recipeStatus changes (when new content is loaded)
    useEffect(() => {
        if (scrollToTopRef.current) {
            scrollToTopRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [recipeStatus]);


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
                    {recipeStatus ? (
                        <div className='recipeDisplay' ref={scrollToTopRef}>
                            <div className='recipeMosaic'>
                                <div className='homeSearchReturn'>
                                    <p>{totalRecipes}</p>
                                    <p className="homeRecipeLabel">Recipes</p>
                                </div>

                                {allRecipes.map((recipe) => (
                                    <RecipeLink key={recipe.id} recipe={recipe} />
                                ))}
                            </div>

                            <PageBar pageStatus={{ currentPage, setCurrentPage, totalPages, scrollToTopRef, apiSearching }} />
                        </div>
                    ) : (
                        <HomeScreen />
                    )}
                </div>
            </div>
        </div>
    )
}
export default RecipeHomePage
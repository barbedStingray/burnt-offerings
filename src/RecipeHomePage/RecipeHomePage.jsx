import React, { useState, useEffect } from 'react'
import './RecipeHomePage.css'

import useFilteredRecipes from './homeFunctions/useFilteredRecipes';
import useDebounce from './homeFunctions/useDebounce';
import HomeScreen from './homeComponents/HomeScreen';
import RecipeLink from './homeComponents/RecipeLink';
import handleApiStatus from './homeFunctions/handleApiStatus';
import HomeNav from './homeComponents/HomeNav';
import PageBar from './homeComponents/PageBar';


const RecipeHomePage = () => {

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

            <HomeNav />

            {/* main display */}
            <div className='homeMainDisplay'>


                <div className='homeTopMain'>
                    <div><p>Mom's Kitchen</p></div>
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
                        <>
                            <div>{handleApiStatus(apiSearching)}</div>

                            <div className='recipeMosaic'>
                                <div className='homeSearchReturn'>
                                    <div className="homeRecipeTotal"><p>{totalRecipes}</p></div>
                                    <div className="homeRecipeLabel"><p>Recipes</p></div>
                                </div>

                                {allRecipes.map((recipe) => (
                                    <RecipeLink key={recipe.id} recipe={recipe} />
                                ))}
                            </div>

                            <PageBar pageStatus={{ currentPage, setCurrentPage, totalPages }} />
                        </>

                    ) : (
                        <HomeScreen />
                    )}
                </div>
            </div>

            {recipeStatus && (
                <div className='homeFooter'>
                    <div className='homePreview'></div>
                </div>
            )}
        </div>
    )
}
export default RecipeHomePage
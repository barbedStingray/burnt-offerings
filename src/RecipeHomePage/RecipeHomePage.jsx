import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import './RecipeHomePage.css'


import { CiCirclePlus } from "react-icons/ci";
import { IoIosArrowDropright } from "react-icons/io";
import { IoIosArrowDropleft } from "react-icons/io";
import { FaInfo } from "react-icons/fa";
import { LuAlarmClock } from "react-icons/lu";
import { TbCookieMan } from "react-icons/tb";
import { LiaCookieBiteSolid } from "react-icons/lia";
import { GiPumpkinLantern } from "react-icons/gi";


import useFilteredRecipes from './homeFunctions/useFilteredRecipes';
import noIconPhoto from '../components/noIconPhoto';
import useDebounce from './homeFunctions/useDebounce';


const RecipeHomePage = () => {

    const [keywords, setKeywords] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const bouncedKeywords = useDebounce(keywords, setCurrentPage)
    const { allRecipes, totalPages, totalRecipes, recipeStatus, apiSearching } = useFilteredRecipes(bouncedKeywords, currentPage)

    // local storage for my keywords
    useEffect(() => {
        const storedKeywords = localStorage.getItem('bouncedKeywords')
        if (storedKeywords) {
            setKeywords(storedKeywords)
        }
    }, [])
    useEffect(() => {
        if (bouncedKeywords) {
            localStorage.setItem('bouncedKeywords', bouncedKeywords)
        }
    }, [bouncedKeywords])



    
    return (
        <div className='homePage'>

            <div className='homeQuarter'></div>


            {/* // todo component navigation */}
            <div className='homeNavigation'>
                <div className='homeNavigationParts'>
                    <Link to={`/createRecipe`} className='homeAddButton'><CiCirclePlus /></Link>
                </div>
                <div className='homeLogoParts'>
                    <div className='homeMomPhoto'></div>
                    <div className='homeStingrayLogo'>Logo</div>
                </div>
            </div>

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
                            // onChange={(e) => keywordChange(e.target.value)}
                            onChange={(e) => setKeywords(e.target.value)}
                        />
                    </div>
                </div>


                <div className='bottomMain'>

                    {recipeStatus === 'loaded' ? (
                        <>
                            {apiSearching === 'working' && (
                                <div>
                                    <p>API SEARCHING</p>
                                </div>
                            )}

                            <div className='recipeMosaic'>
                                <div className='homeSearchReturn'>
                                    <div className="homeRecipeTotal"><p>{totalRecipes}</p></div>
                                    <div className="homeRecipeLabel"><p>Recipes</p></div>
                                </div>

                                {allRecipes.map((recipe, i) => (
                                    // todo this is a component
                                    <Link
                                        key={i}
                                        to={`/recipeDetails/${recipe.id}`}
                                        // onClick={() => seeRecipeDetails(recipe.id)}
                                        className={`recipeContainer`}
                                        style={{ animationDelay: `${i * 100}ms` }}
                                    >
                                        <div className='recipeMosaicPhoto'>
                                            {recipe.picture?.startsWith('http') ? (
                                                <img className='mosaicPhoto' src={recipe.picture} />
                                            ) : (
                                                <p className='homeGeneratedIcon'>{noIconPhoto(recipe.picture)}</p>
                                            )}
                                        </div>

                                        <div className='cardDisplay'>
                                            <div className='cardDetails'>
                                                <p className='homeRecipeTitle'>{recipe.title}</p>
                                                {/* // todo if you want ingredients displayed, you have to count them */}
                                                <p className='homeDetail'><span className='homeIconDetail'><FaInfo /></span>{recipe.servings}</p>
                                                <p className='homeDetail'><span className='homeIconDetail'><LuAlarmClock /></span>{recipe.prep_time}</p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>


                            <div className='paginationBar'>
                                <div
                                    className={`homePageNext ${currentPage === 1 ? 'homeNextDeactivate' : ''}`}
                                    onClick={currentPage === 1 ? null : () => setCurrentPage(currentPage - 1)}
                                >
                                    <IoIosArrowDropleft />
                                </div>
                                <div
                                    className={`homePageNext ${currentPage === totalPages ? 'homeNextDeactivate' : ''}`}
                                    onClick={currentPage === totalPages ? null : () => setCurrentPage(currentPage + 1)}
                                >
                                    <IoIosArrowDropright />
                                </div>
                            </div>
                        </>

                    ) : (
                        <div className='homeNoRecipes'>
                            <p className='homeNoRecipeText'>Search Recipes!</p>
                            {/* <div className='homeNoCookieMan'><TbCookieMan /></div> */}
                            <div className='homeNoCookieMan'><GiPumpkinLantern /></div>
                            {apiSearching === 'error' && (
                                <p>API SEARCHING</p>
                            )}

                        </div>
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
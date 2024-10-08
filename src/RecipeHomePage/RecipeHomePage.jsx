import React, { useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom';
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


const RecipeHomePage = () => {

    const navigate = useNavigate()
    const debounceTimoutRef = useRef(null) // delay in db request
    const [uniqueKey, setUniqueKey] = useState(0) // forced re-render for animation

    const [keywords, setKeywords] = useState('')
    const [bouncedKeywords, setBouncedKeywords] = useState('')
    const [currentPage, setCurrentPage] = useState(1)

    const { allRecipes, totalPages, totalRecipes, loadingStatus } = useFilteredRecipes(bouncedKeywords, currentPage)


    const keywordChange = (keywords) => {
        setKeywords(keywords)
        if (debounceTimoutRef.current) {
            clearTimeout(debounceTimoutRef.current)
        }
        debounceTimoutRef.current = setTimeout(() => {
            setBouncedKeywords(keywords)
            setCurrentPage(1)
            // trigger animation
            setUniqueKey(uniqueKey + 1)
        }, 1000)
    }
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage)
        setUniqueKey(uniqueKey + 1)
    }



    // ? make each one a link with the id? 
    function seeRecipeDetails(recipeID) {
        navigate(`/recipeDetails/${recipeID}`)
    }


    return (
        <div className='homePage'>
            <div className='homeQuarter'></div>

            {/* navigation */}
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
                    {/* other element here... */}
                    <div className='homeSearchBar'>
                        <input
                            className='homeKeywordSearch'
                            type='text'
                            placeholder='Search Keywords...'
                            value={keywords}
                            onChange={(e) => keywordChange(e.target.value)}
                        />
                    </div>
                </div>


                <div className='bottomMain'>


                    {loadingStatus === 'loaded' ? (
                        <>
                            <div className='recipeMosaic'>
                                <div className='homeSearchReturn'>
                                    <div className="homeRecipeTotal">{totalRecipes}</div>
                                    <div className="homeRecipeLabel">Recipes</div>
                                </div>

                                {allRecipes.map((recipe, i) => (
                                    <div
                                        key={`${uniqueKey}-${i}`}
                                        onClick={() => seeRecipeDetails(recipe.id)}
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
                                    </div>
                                ))}
                            </div>


                            <div className='paginationBar'>
                                <div
                                    className={`homePageNext ${currentPage === 1 ? 'homeNextDeactivate' : ''}`}
                                    onClick={currentPage === 1 ? null : () => handlePageChange(currentPage - 1)}
                                >
                                    <IoIosArrowDropleft />
                                </div>
                                <div
                                    className={`homePageNext ${currentPage === totalPages ? 'homeNextDeactivate' : ''}`}
                                    onClick={currentPage === totalPages ? null : () => handlePageChange(currentPage + 1)}
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
                        </div>
                    )}

                </div>

            </div>

            {loadingStatus && (
                <div className='homeFooter'>
                    <div className='homePreview'></div>
                </div>
            )}

        </div>
    )
}
export default RecipeHomePage
import React, { useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios'
import './RecipeHomePage.css'


import { CiCirclePlus } from "react-icons/ci";
import { IoIosArrowDropright } from "react-icons/io";
import { IoIosArrowDropleft } from "react-icons/io";
import { FaInfo } from "react-icons/fa";
import { LuAlarmClock } from "react-icons/lu";
import { TbCookieMan } from "react-icons/tb";
import { LiaCookieBiteSolid } from "react-icons/lia";
import { GiPumpkinLantern } from "react-icons/gi";




const RecipeHomePage = () => {

    const navigate = useNavigate()
    const debounceTimoutRef = useRef(null) // delay in db request
    const [uniqueKey, setUniqueKey] = useState(0) // forced re-render for animation



    const [keywords, setKeywords] = useState('')
    const [allRecipes, setAllRecipes] = useState([])
    // console.log('allRecipes', allRecipes)
    const [loadingStatus, setLoadingStatus] = useState('unloaded')

    // pagination
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalRecipes, setTotalRecipes] = useState(0)
    const recipesPerPage = 5

    // display recipe
    const [displayRecipe, setDisplayRecipe] = useState([])


    // todo make this it's own utility function eventually
    const fetchFilteredRecipes = async (keywords, page = 1) => {
        setLoadingStatus('loading')

        if (!keywords) {
            console.log('no keywords!', keywords)
            setAllRecipes([])
            setTotalPages(1)
            setTotalRecipes(0)
            setLoadingStatus('loaded')
            return // do not call api if no keywords exist
        }
        try {
            const response = await axios.get('/api/recipes/all', {
                params: { keywords, offset: (page - 1) * recipesPerPage, limit: recipesPerPage },
            })
            setAllRecipes(response.data.recipes)
            setTotalPages(response.data.totalPages)
            setTotalRecipes(response.data.totalRecipes)
            setLoadingStatus('loaded')
        } catch (error) {
            console.log('error in loading api recipes', error)
            setLoadingStatus('error') // todo alert user to an error
        }
    }

    const keywordChange = (keywords) => {
        setKeywords(keywords)
        setCurrentPage(1) // resets to 1st page on new keyword... ?

        if (debounceTimoutRef.current) {
            clearTimeout(debounceTimoutRef.current)
        }
        debounceTimoutRef.current = setTimeout(() => {
            fetchFilteredRecipes(keywords, 1) // always fetch from page 1 with new keyword
        }, 1000)
    }


    const handlePageChange = (newPage) => {
        setCurrentPage(newPage)
        fetchFilteredRecipes(keywords, newPage) // fetch the recipes for the new page
        setUniqueKey(uniqueKey + 1)
    }

    // todo refactor buttons for singular button...
    function seeRecipeDetails(recipeID) {
        // console.log('viewing details of', recipeID)
        navigate(`/recipeDetails/${recipeID}`)
    }
    function goToCreateRecipePage() {
        navigate(`/createRecipe`)
    }





    return (
        <div className='homePage'>
            <div className='homeQuarter'></div>

            {/* navigation */}
            <div className='homeNavigation'>
                <div className='homeNavigationLinks'>
                    <Link to={`/createRecipe`} className='homeAddButton'><CiCirclePlus /></Link>
                    <div className='homeNavButton'>Home</div>
                    <div className='homeNavButton'>Other</div>
                    {/* Others... */}
                </div>
                <div className='homeStingrayLogo'>Logo</div>
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


                    {allRecipes.length === 0 ? (
                        <div className='homeNoRecipes'>
                            <p className='homeNoRecipeText'>Search Recipes!</p>
                            {/* <div className='homeNoCookieMan'><TbCookieMan /></div> */}
                            <div className='homeNoCookieMan'><GiPumpkinLantern /></div>
                        </div>
                    ) : (
                        <>
                            <div className='recipeMosaic'>
                                <div className='homeSearchReturn'>
                                    <div className="homeRecipeTotal">{totalRecipes}</div>
                                    <div className="homeRecipeLabel">Recipes</div>
                                </div>

                                {allRecipes.map((recipe, i) => (
                                    <div
                                        // key={i}
                                        key={`${uniqueKey}-${i}`}
                                        onClick={() => seeRecipeDetails(recipe.id)}
                                        className={`recipeContainer`}
                                        style={{ animationDelay: `${i * 100}ms` }}
                                    >
                                        <div className='recipePhoto'></div>
                                        <div className='cardDisplay'>
                                            <div className='cardDetails'>
                                                <p className='homeRecipeTitle'>{recipe.title}</p>
                                                <p className='homeDetail'><span className='homeIconDetail'><FaInfo /></span> 10</p>
                                                <p className='homeDetail'><span className='homeIconDetail'><LuAlarmClock /></span> 180m</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className='paginationBar'>
                                <div
                                    className={`homePageNext ${currentPage === 1 ? 'homeNextDeactivate' : ''}`}
                                    onClick={currentPage === 1 ? null : () => handlePageChange(currentPage - 1)}
                                ><IoIosArrowDropleft /></div>
                                <div
                                    className={`homePageNext ${currentPage === totalPages ? 'homeNextDeactivate' : ''}`}
                                    onClick={currentPage === totalPages ? null : () => handlePageChange(currentPage + 1)}
                                ><IoIosArrowDropright /></div>
                            </div>
                        </>
                    )}


                </div>

            </div>


            {/* sub display */}
            <div className='homeSubDisplay'>
                <div className='momPic'></div>
                <div className='recipePreview'>Pic</div>
            </div>




        </div>
    )
}

export default RecipeHomePage
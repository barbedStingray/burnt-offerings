import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import './RecipeHomePage.css'



const RecipeHomePage = () => {

    const navigate = useNavigate()
    const debounceTimoutRef = useRef(null)

    const [keywords, setKeywords] = useState('')
    const [allRecipes, setAllRecipes] = useState([])
    const [loadingStatus, setLoadingStatus] = useState('unloaded')

    // pagination
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalRecipes, setTotalRecipes] = useState(0)
    const recipesPerPage = 10


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
    }



    // todo refactor buttons for singular button...
    function seeRecipeDetails(recipeID) {
        // console.log('viewing details of', recipeID)
        navigate(`/recipeDetails/${recipeID}`)
    }
    function goToCreateRecipePage(recipeID) {
        // console.log('viewing details of', recipeID)
        navigate(`/createRecipe`)
    }





    return (
        <div className='homePage'>
            <div className='greetingContainer'>
                <div className='greeting'>
                    <p>Hello!</p>
                    <p>Whatcha Cookin??</p>
                </div>
                <div className='momPic'>mom</div>
            </div>


            <div className='homeSearchBar'>
                <input
                    className='keywordSearch'
                    type='text'
                    placeholder='Search Keywords...'
                    value={keywords}
                    onChange={(e) => keywordChange(e.target.value)}
                />
            </div>




            <div className='displayMosaic'>
                <div className="searchReturn">{totalRecipes} | Recipes</div>
                {allRecipes.map((recipe, i) => (
                    <div
                        onClick={() => seeRecipeDetails(recipe.id)}
                        className={`recipeContainer`}
                    >
                        <div className='recipePhoto'></div>
                        <div className='cardDisplay'>
                            <h4>{recipe.title}</h4>
                            <p>10 Ingredients</p>
                            <p>{recipe.prep_time}</p>
                        </div>
                    </div>
                ))}
                <div className='lastSquareDiv'></div>
            </div>




            {/* pagination controls */}
            {keywords.length === 0 ? (

                <div className='navBar' onClick={() => goToCreateRecipePage()}>
                    <p>+</p>
                </div>

            ) : (

                <div className='paginationBar'>
                    <button
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                    >Previous</button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                    >Next</button>
                </div>
            )}

        </div>
    )
}

export default RecipeHomePage
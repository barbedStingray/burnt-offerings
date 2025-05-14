import React from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import scrollToForm from '../../CreateRecipePage/createFunctions/scrollFunctions/scrollToForm'



const DisplaySubRecipes = ({ editPackage, detailPackage }) => {
    const dispatch = useDispatch()
    const { letsEdit, setAddMoreView, i, horizontalScrollRef } = editPackage
    const { recipe, subRecipes, parentRecipes, mainRecipe } = detailPackage

    const isSubRecipe = recipe.recipeDetails.is_sub_recipe
    const mainTitle = mainRecipe.recipeDetails.title

    const viewParentRecipe = async (newId) => {
        try {
            // todo activate spinner
            const results = await axios.get(`/api/recipes/details/${newId}`)
            const { mainRecipe, subRecipes, parentRecipes } = results.data
            dispatch({ type: 'SET_RECIPE', payload: { mainRecipe, subRecipes, parentRecipes } })

        } catch (error) {
            console.log('error in fetching details', error)
        } finally {
            // todo scroll to top of page

            setTimeout(() => {
                window.scrollTo({ top: 0, behavior: 'smooth' })
            }, 100)

            // todo turn spinner off
        }

    }

    return (
        <div className='detailSubRecipes'>
            <div className='subRecipeHeader'>
                <p>{recipe.recipeDetails.is_sub_recipe ? 'Parent Recipes' : 'Sub Recipes'}</p>
                {letsEdit && !recipe.recipeDetails.is_sub_recipe && (
                    <button className='fireButton addFire' onClick={() => setAddMoreView('subRecipe')}></button>
                )}
            </div>
            <div className='detailSubDisplay'>
                {i === 0 ? (
                    <div className='detailSubView'>
                        {isSubRecipe ? (
                            <>
                                {parentRecipes.map((parent, i) => (
                                    <div key={i} className='displaySingleSub'>
                                        <div onClick={() => viewParentRecipe(parent.id)} key={i}>{parent.title}</div>
                                    </div>
                                ))}
                            </>
                        ) : (
                            <>
                                {subRecipes.map((sub, i) => (
                                    <div key={i} className='displaySingleSub'>
                                        <p onClick={() => scrollToForm((i + 1), horizontalScrollRef)}>{sub.recipeDetails.title}</p>
                                    </div>
                                ))}

                            </>
                        )}
                    </div>
                ) : (
                    <div className='detailSubView'>
                        <p>Currently Viewing: <span className='mainLink' onClick={() => scrollToForm(0, horizontalScrollRef)} >{mainTitle}</span></p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default DisplaySubRecipes

import React from 'react'
import { Link } from 'react-router-dom'
import scrollToForm from '../../CreateRecipePage/createFunctions/scrollFunctions/scrollToForm'



const DisplaySubRecipes = ({ editPackage, detailPackage }) => {
    const { letsEdit, setAddMoreView } = editPackage
    const { scrollIndex, recipe, theSubRecipes, theParentRecipes, horizontalScrollRef } = detailPackage

    const isSubRecipe = recipe.recipeDetails.is_sub_recipe


    return (
        <div className='detailSubRecipes'>
            <div className='subRecipeHeader'>
                <p>{recipe.recipeDetails.is_sub_recipe ? 'Parent Recipes' : 'Sub Recipes'}</p>
                {letsEdit && !recipe.recipeDetails.is_sub_recipe && (
                    <button className='fireButton addFire' onClick={() => setAddMoreView('subRecipe')}></button>
                )}
            </div>
            <div className='detailSubDisplay'>
                {scrollIndex === 0 && (
                    <div className='detailSubView'>
                        {isSubRecipe ? (
                            <>
                                {theParentRecipes.map((parent, i) => (
                                    <div key={i} className='displaySingleSub'>
                                        <Link to={`/recipeDetails/${parent.id}`} key={i}>{parent.title}</Link>
                                    </div>
                                ))}
                            </>
                        ) : (
                            <>
                                {theSubRecipes.map((sub, i) => (
                                    <div key={i} className='displaySingleSub'>
                                        <p onClick={() => scrollToForm((i + 1), horizontalScrollRef)}>{sub.recipeDetails.title}</p>
                                    </div>
                                ))}

                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default DisplaySubRecipes

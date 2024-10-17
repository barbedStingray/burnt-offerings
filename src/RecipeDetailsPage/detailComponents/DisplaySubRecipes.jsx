import React from 'react'
import { Link } from 'react-router-dom'
import deleteSoloDetail from '../detailFunctions/deleteSoloDetail'
import scrollToForm from '../../CreateRecipePage/createFunctions/scrollFunctions/scrollToForm'



const DisplaySubRecipes = ({ editPackage, detailPackage }) => {
    const { displayId, recipeID, refresh, letsEdit, setRefresh, setAddMoreView } = editPackage
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
                {scrollIndex === 0 ? (
                    <div className='detailSubView'>
                        {isSubRecipe ? (
                            <>
                                {theParentRecipes.map((parent, i) => (
                                    <div key={i} className='displaySingleSub'>
                                        <Link to={`/recipeDetails/${parent.id}`} key={i}>{parent.title}{parent.id}</Link>
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
                ) : (
                    <div className='currentSubRecipe'>
                        <p>You are viewing a Parent Recipe!</p>
                        <button className='deleteButton' onClick={() => deleteSoloDetail('subRecipe', displayId, refresh, setRefresh, null, recipeID)}>Remove Sub Recipe</button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default DisplaySubRecipes

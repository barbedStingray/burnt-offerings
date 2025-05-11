import React from 'react'
import { Link } from 'react-router-dom'
import scrollToForm from '../../CreateRecipePage/createFunctions/scrollFunctions/scrollToForm'



const DisplaySubRecipes = ({ editPackage, detailPackage }) => {
    const { letsEdit, setAddMoreView, i, horizontalScrollRef } = editPackage
    const { recipe, theSubRecipes, theParentRecipes, theMainRecipe } = detailPackage

    const isSubRecipe = recipe.recipeDetails.is_sub_recipe
    console.log('theMain', theMainRecipe.recipeDetails.title)
    const mainTitle = theMainRecipe.recipeDetails.title

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

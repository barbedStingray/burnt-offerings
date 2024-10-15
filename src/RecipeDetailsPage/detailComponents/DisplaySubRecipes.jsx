import React from 'react'
import { Link } from 'react-router-dom'
import deleteSoloDetail from '../../components/deleteSoloDetail'
import scrollToForm from '../../CreateRecipePage/createFunctions/scrollFunctions/scrollToForm'



const DisplaySubRecipes = ({ editPackage, detailPackage }) => {
    const { displayId, recipeID, refresh, letsEdit, setRefresh, setEditView } = editPackage
    const { scrollIndex, recipe, theSubRecipes, theParentRecipes, horizontalScrollRef } = detailPackage

    const isSubRecipe = recipe.recipeDetails.is_sub_recipe
    const isParentRecipe = recipe.recipeDetails.is_parent_recipe


    
    return (
        <div className='detailSubRecipes'>
            <div className='detailSectionHeader'>
                {/* Header */}
                {isSubRecipe && (
                    <p>Parent Recipes</p>
                )}
                {isParentRecipe && (
                    <p>Sub Recipes</p>
                )}
                {!isParentRecipe && !isSubRecipe && (
                    <p>Sub Recipes</p>
                )}
                {letsEdit && !isSubRecipe && (
                    <button className='fireButton addFire' onClick={() => setEditView('subRecipe')}></button>
                )}
            </div>
            {scrollIndex > 0 ? (
                // scroll index is on  sub recipe
                <div className='viewingSubRecipe'>
                    <p>This is part of your Main Recipe!</p>
                    <button onClick={() => deleteSoloDetail('subRecipe', displayId, refresh, setRefresh, recipeID)}>Remove Sub Recipe</button>
                </div>
            ) : (
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
                                <div className='displaySingleSub'>
                                    <p key={i} onClick={() => scrollToForm((i + 1), horizontalScrollRef)}>{sub.recipeDetails.title}</p>
                                </div>
                            ))}

                        </>
                    )}
                </div>
            )}
        </div>
    )
}

export default DisplaySubRecipes

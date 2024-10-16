import axios from 'axios'

// * steps ingredient
export default async function deleteSoloDetail(type, id, refresh, setRefresh, setEditModalView, parentId) {
    console.log('delete solo detail', type, id, refresh, parentId)

    const apiCalls = {
        subRecipe: `/api/recipes/removeSubRecipe/${id}`,
        ingredient: `/api/recipes/deleteRecipeIngredient/${id}`,
        instructions: `/api/recipes/deleteRecipeStep/${id}`,
        tag: `/api/recipes/deleteRecipeTag/${id}`,
    }

    const deleteText = apiCalls[type]
    console.log('deleteText', deleteText)
    try {
        if (type === 'subRecipe') {
            await axios.delete(deleteText, { data: { parentId } })
        } else {
            await axios.delete(deleteText)
        }
        setRefresh(!refresh)
        if (!setEditModalView) return // for tags & subRecipes not using edit modal
        setEditModalView(false)

    } catch (error) {
        console.log(`ERROR removing ${type}`, error)
        alert(`sorry, there was a problem removing your ${type} `)
    }
}


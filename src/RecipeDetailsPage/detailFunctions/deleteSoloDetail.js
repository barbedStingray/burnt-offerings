import axios from 'axios'

// * steps ingredient
export default async function deleteSoloDetail(type, id, refresh, setRefresh, setEditModalView, parentId) {

    const deleteMessage = {
        subRecipe: 'Remove this Sub Recipe?',
        ingredient: 'Delete this ingredient?',
        instructions: 'Delete this step?',
    }
    if (type !== 'tag') {
        const confirmDelete = window.confirm(deleteMessage[type])
        if (!confirmDelete) return
    }

    const apiCalls = {
        subRecipe: `/api/recipes/removeSubRecipe/${id}`,
        ingredient: `/api/recipes/deleteRecipeIngredient/${id}`,
        instructions: `/api/recipes/deleteRecipeStep/${id}`,
        tag: `/api/recipes/deleteRecipeTag/${id}`,
    }
    const deleteText = apiCalls[type]
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
        alert(`sorry, there was a problem removing your ${type} `)
    }
}


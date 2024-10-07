import axios from 'axios'


export default async function deleteSoloDetail(type, id, refresh, setRefresh, parentId, setRecipeIndex) {
    console.log('delete solo detail', type, id, parentId)

    const apiCalls = {
        subRecipe: `/api/recipes/removeSubRecipe/${id}`,
        ingredient: `/api/recipes/deleteRecipeIngredient/${id}`,
        step: `/api/recipes/deleteRecipeStep/${id}`,
        tag: `/api/recipes/deleteRecipeTag/${id}`,
    }
    const deleteText = apiCalls[type]
    

    try {
        if (type === 'subRecipe') {
            await axios.delete(deleteText, { data: { parentId }})
        } else {
            await axios.delete(deleteText)
        }
        setRefresh(!refresh)
        setRecipeIndex(0)
    } catch (error) {
        console.log(`ERROR removing ${type}`, error)
        // return some form of user error.
        alert(`sorry, there was a problem removing your ${type} `)
    }
}


import axios from 'axios'

export default async function postOnlyType(type, recipeID, typePackage, setTypePackage, refresh, setRefresh, setAddMoreView) {

    const apiCalls = {
        subRecipes: '/api/recipes/postOnlySubRecipes',
        ingredients: '/api/recipes/postOnlyIngredients',
        steps: '/api/recipes/postOnlySteps',
        tags: '/api/recipes/postOnlyTags',
    }
    const postText = apiCalls[type]

    if (typePackage.length === 0) {
        alert('You have not added any new information')
        return
    }
    try {
        await axios.post(`${postText}`, { recipeID, typePackage })
        setTypePackage([])
        setRefresh(!refresh)
        setAddMoreView('')
    } catch (error) {
        alert('something went wrong posting only TYPE!')
    }
}


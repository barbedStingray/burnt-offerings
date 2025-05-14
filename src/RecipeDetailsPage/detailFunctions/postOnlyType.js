import axios from 'axios'

export default async function postOnlyType(type, displayId, typePackage, setTypePackage, setAddMoreView, recipeID, dispatch) {

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
        await axios.post(`${postText}`, { displayId, typePackage })
        setTypePackage([])
        setAddMoreView('')

        const results = await axios.get(`/api/recipes/details/${recipeID}`)
        const { mainRecipe, subRecipes, parentRecipes } = results.data
        dispatch({ type: 'SET_RECIPE', payload: { mainRecipe, subRecipes, parentRecipes }})

    } catch (error) {
        alert('something went wrong posting only TYPE!')
    }
}


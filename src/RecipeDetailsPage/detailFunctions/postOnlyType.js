import axios from 'axios'



export default async function postOnlyType(type, recipeID, typePackage, setTypePackage, refresh, setRefresh, setAddMoreView) {

    const apiCalls = {
        subRecipes: '/api/recipes/postOnlySubRecipes',
        ingredients: '/api/recipes/postOnlyIngredients',
        steps: '/api/recipes/postOnlySteps',
        tags: '/api/recipes/postOnlyTags',
    }
    const postText = apiCalls[type]
    console.log('postText', postText)


    if (typePackage.length === 0) {
        alert('You have not added any new information')
        return
    }
    try {
        console.log('posting steps', typePackage)
        await axios.post(`${postText}`, { recipeID, typePackage })
        // todo !! loading screen? error handling of duplicates?
        setTypePackage([])
        setRefresh(!refresh)
        setAddMoreView('')
    } catch (error) {
        console.log('error client side postOnlyType', error)
        alert('something went wrong posting only TYPE!')
    }
}


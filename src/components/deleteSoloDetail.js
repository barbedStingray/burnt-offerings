import axios from 'axios'


export default async function deleteSoloDetail(type, id, refresh, setRefresh) {
    console.log('delete solo detail', type, id)

    const apiCalls = {
        subrecipe: ``,
        ingredient: `/api/recipes/deleteRecipeIngredient/${id}`,
        step: `/api/recipes/deleteRecipeStep/${id}`,
        tag: `/api/recipes/deleteRecipeTag/${id}`,
    }
    const deleteText = apiCalls[type]
    

    try {
        await axios.delete(`${deleteText}`)
        setRefresh(!refresh)
    } catch (error) {
        console.log('ERROR delete ind. step', error)
        // return some form of user error.
        alert('sorry, there was a problem deleting your item')
    }
}


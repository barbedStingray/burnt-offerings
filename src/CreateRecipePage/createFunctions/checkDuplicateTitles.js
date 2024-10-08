
export default function checkDuplicateTitles(newObject, allRecipes) {
   console.log('newObject', newObject)

    // ! check for duplicate name
    const isDuplicate = allRecipes.map((recipe) => recipe.title.toLowerCase()).includes(newObject.newTitle.toLowerCase())
    console.log('isDuplicate', isDuplicate)
    
    if (isDuplicate) {
        alert('Your title is a duplicate!')
        return false
    }
    return true
}

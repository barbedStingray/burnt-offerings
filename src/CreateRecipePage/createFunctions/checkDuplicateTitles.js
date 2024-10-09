
export default function checkDuplicateTitles(newObject, allRecipes) {
    const isDuplicate = allRecipes.map((recipe) => recipe.title.toLowerCase()).includes(newObject.newTitle.toLowerCase())    
    if (isDuplicate) {
        alert('Your title is a duplicate!')
        return false
    }
    return true
}

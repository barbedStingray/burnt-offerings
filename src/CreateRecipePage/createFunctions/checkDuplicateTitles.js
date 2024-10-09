
// checking an object
export default function checkDuplicateTitles(title, allRecipes) {
    const isDuplicate = allRecipes.map((recipe) => recipe.title.toLowerCase()).includes(title.toLowerCase())    
    if (isDuplicate) {
        alert('Your title is a duplicate!')
        return true
    }
    return false
}



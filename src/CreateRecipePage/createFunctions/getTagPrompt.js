const tagPrompt = [
    'What kind of food is this?',
    'What Type of Cuisine is it?',
    'What Season would you make it for?',
    'Add any other Tags you like!'
]
const getTagPrompt = (tagPackage) => {
    if (tagPackage.length === 0) {
        return tagPrompt[0]
    } else if (tagPackage.length === 1) {
        return tagPrompt[1]
    } else if (tagPackage.length === 2) {
        return tagPrompt[2]
    }
    else {
        return tagPrompt[3]
    }
}
export default getTagPrompt



// Prepares final array when CREATING a new recipe
// to be sent to the DB for further processing
export default function handlePackingArray(e, soloObject, setSoloObject, packageArray, setPackageArray) {
    e.preventDefault()
    console.log('adding part to the recipe', soloObject)

    const attributes = Object.keys(soloObject)
    console.log('attributes', attributes)

    // todo NEED A CHECK TO MAKE SURE ALL ATTRIBUTES HAVE A VALUE -- do this in the add button?
    // todo different function checks for different sources?
    // - recipe Ingredients...(next)
    // - sub Recipes - check sub recipe not entering one that doesnt exist
    // - ingredients check ingredient and format
    // - Tags check tag and format
    // - Steps check step and format
    // - tag guided progression...
    // todo NEED CHECKS SO THAT PACKING ARRAY IS FINAL

    attributes.forEach((attribute) => { // ! todo THIS ERRORS IF IT'S BLANK
        const wordToFormat = soloObject[attribute].toString()
        console.log('wordToFormat', wordToFormat)
        const completedWord = wordToFormat.charAt(0).toUpperCase() + wordToFormat.slice(1).toLowerCase()
        soloObject[attribute] = completedWord
    })


    setPackageArray([...packageArray, soloObject])

    // reset your object that came in
    const resetObject = {}
    attributes.forEach((attribute) => {
        resetObject[attribute] = '' // empty string or you can set default values here
    })
    setSoloObject(resetObject)
}


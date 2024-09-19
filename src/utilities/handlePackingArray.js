
// Prepares final array when CREATING a new recipe
// to be sent to the DB for further processing
export default function handlePackingArray(e, soloObject, setSoloObject, packageArray, setPackageArray) {
    e.preventDefault()
    console.log('adding part to the recipe', soloObject)

    const attributes = Object.keys(soloObject)

    // todo NEED A CHECK TO MAKE SURE ALL ATTRIBUTES HAVE A VALUE
    // todo NEED CHECKS SO THAT PACKING ARRAY IS FINAL
    
    // todo increment steps automatically? 

    attributes.forEach((attribute) => {
        const wordToFormat = soloObject[attribute]
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


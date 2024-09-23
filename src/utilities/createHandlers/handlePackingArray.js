
// Prepares final array when CREATING a new recipe
// to be sent to the DB for further processing
import handleValueChecks from "./handleValueChecks"

export default function handlePackingArray(e, soloVariable, setSoloVariable, packageArray, setPackageArray, setFilteredTags) {
    e.preventDefault()
    console.log('handlePackingArray', soloVariable)

    // todo all checks should be done here wether or not it's an objeect
    const soloVariableType = typeof(soloVariable)
    console.log('soloVariableType', soloVariableType)

    let isValue
    if (soloVariableType === 'object') {
        const checkValueArray = Object.values(soloVariable)
        console.log('checkValueArray', checkValueArray)
        isValue = (handleValueChecks(...checkValueArray))
    } else {
        isValue = (handleValueChecks(soloVariable))
    }

    
    console.log('isValue', isValue)
    if (!isValue) return alert('Please check your values!')

    // set array
    setPackageArray([...packageArray, soloVariable])

    
    // reset object/variables
    console.log('typeof', typeof(soloVariable))
    if (typeof soloVariable === 'object') {
        console.log('need to format the object...', soloVariable)
        const allKeys = Object.keys(soloVariable)
        console.log('allKeys', allKeys)
        // todo - refactor for wide use? only ingredient is using this...
        const resetObject = {}
        allKeys.forEach((key) => {
            resetObject[key] = ''
        })
        console.log('resetObject', resetObject)
        setSoloVariable(resetObject)
    } else {
        // reset single variable
        setSoloVariable('')
    }

    setFilteredTags([])
}


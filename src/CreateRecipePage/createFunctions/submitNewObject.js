import handleValueIsPresent from "./handleValueIsPresent"

// ! push your OBJECT to the dataArray for DB
export default function submitNewObject(e, newObject, setNewObject, searchList, dataPackage, setDataPackage, initialState, setFilteredList) {
    e.preventDefault()

    // ! probably part of the bunder/format function
    const formName = e.currentTarget.closest('form').name
    console.log('formName', formName)
    console.log('submitNewObject', newObject)
    
    const tagKeyword = newObject[formName]
    console.log('tagKeyword', tagKeyword)

    // ! pass your checks - own function
    // todo duplicate tag check
    // todo duplicate ingredient check
    // todo ? Two-word tags?

    // const checkValueArray = Object.values(newObject)
    // console.log('checkValueArray', checkValueArray)
    const isValue = handleValueIsPresent(newObject)
    if (!isValue) return

    // ! Bundler - own function
    let tagKeywordFormat
    if (formName !== 'title' && formName !== 'instructions') {
        tagKeywordFormat = tagKeyword.trim().charAt(0).toUpperCase() + tagKeyword.trim().slice(1).toLowerCase()
    } else {
        tagKeywordFormat = tagKeyword
    }
    // console.log('keywordFormat', tagKeywordFormat)
    // console.log('searchList', searchList)
    let matchedTag = searchList.find((item) => item[formName] === tagKeywordFormat)
    // console.log('matchedTag', matchedTag) 

    let finalObject
    if (!matchedTag) {
        finalObject = { ...newObject, id: 'zero', [formName]: tagKeywordFormat }
    } else {
        finalObject = { ...newObject, id: matchedTag.id, [formName]: matchedTag[formName] }
    }

    // ! Update newTagData
    setDataPackage([...dataPackage, finalObject])
    // ! Clear Inputs
    setNewObject(initialState)
    setFilteredList([])
}






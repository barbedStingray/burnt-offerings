import handleValueIsPresent from "./handleValueIsPresent"

// push your formed Object to the according package for db
export default function submitNewObject(e, newObject, setNewObject, searchList, dataPackage, setDataPackage, initialState, setFilteredList) {
    e.preventDefault()

    // ! bunder/format function
    const formName = e.currentTarget.closest('form').name
    const tagKeyword = newObject[formName]
    const isValue = handleValueIsPresent(newObject)
    if (!isValue) return

    let tagKeywordFormat
    if (formName !== 'title' && formName !== 'instructions') {
        tagKeywordFormat = tagKeyword.trim().charAt(0).toUpperCase() + tagKeyword.trim().slice(1).toLowerCase()
    } else {
        tagKeywordFormat = tagKeyword
    }
    let matchedTag = searchList.find((item) => item[formName] === tagKeywordFormat)

    let finalObject
    if (!matchedTag) {
        finalObject = { ...newObject, id: 'zero', [formName]: tagKeywordFormat }
    } else {
        finalObject = { ...newObject, id: matchedTag.id, [formName]: matchedTag[formName] }
    }
    // ! bundler end

    // update packages
    setDataPackage([...dataPackage, finalObject])
    // clear inputs
    setNewObject(initialState)
    setFilteredList([])
}






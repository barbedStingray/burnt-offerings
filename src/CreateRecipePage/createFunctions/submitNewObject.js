import handleValueIsPresent from "./handleValueIsPresent"

// ! push your OBJECT to the dataArray for DB
export default function submitNewObject(e, newObject, setNewObject, searchList, dataPackage, setDataPackage, initialState, setFilteredList) {
    e.preventDefault()
    const formName = e.currentTarget.closest('form').name
    console.log('formName', formName)
    console.log('submitNewObject', newObject)
    
    const tagKeyword = newObject[formName]
    console.log('tagKeyword', tagKeyword)

    // ! pass your checks - own function
    // todo duplicate tag check
    // todo duplicate ingredient check
    // todo ? Two-word tags?
    const checkValueArray = Object.values(newObject)
    console.log('checkValueArray', checkValueArray)
    const isValue = handleValueIsPresent(...checkValueArray)
    if (!isValue) return alert('please check your inputs!')

    // ! Bundler - own function
    let tagKeywordFormat
    if (formName !== 'title' && formName !== 'instructions') { // todo also account for steps...
        tagKeywordFormat = tagKeyword.trim().charAt(0).toUpperCase() + tagKeyword.trim().slice(1).toLowerCase()
    } else {
        tagKeywordFormat = tagKeyword
    }
    console.log('keywordFormat', tagKeywordFormat)
    console.log('searchList', searchList)
    let matchedTag = searchList.find((item) => item[formName] === tagKeywordFormat)
    console.log('matchedTag', matchedTag) 

    let finalObject
    if (!matchedTag) {
        finalObject = { ...newObject, id: 'zero', [formName]: tagKeywordFormat }
    } else {
        finalObject = { ...newObject, id: matchedTag.id, [formName]: matchedTag[formName] }
    }

    // // ! Bundler - own function
    // const tagKeywordFormat = tagKeyword.trim().charAt(0).toUpperCase() + tagKeyword.trim().slice(1).toLowerCase();
    // console.log('keywordFormat', tagKeywordFormat)
    // console.log('searchList', searchList)
    // let matchedTag = searchList.find((item) => item[formName] === tagKeywordFormat)
    // console.log('matchedTag', matchedTag)
    // if (!matchedTag) {
    //     matchedTag = { ...newObject, [formName]: tagKeywordFormat, id: 'zero' }
    // }

    // ! Update newTagData
    setDataPackage([...dataPackage, finalObject])
    // ! Clear Inputs
    setNewObject(initialState)
    setFilteredList([])
}





// ! original function for newTAGS
// function submitNewTag(e, newTag) {
//     e.preventDefault()
//     // const formName = e.target.value ? e.target.value : e.currentTarget.closest('form').name
//     const formName = e.currentTarget.closest('form').name
//     console.log('formName', formName)
//     console.log('submitNewTag', newTag)
//     const tagKeyword = newTag[formName]
//     console.log('tagKeyword', tagKeyword)

//     // ! pass your checks
//     // todo logic for if a tag exists, no duplicate tags...
//     // todo ? Two-word tags?
//     const checkValueArray = Object.values(newTag)
//     console.log('checkValueArray', checkValueArray)
//     const isValue = handleValueChecks(...checkValueArray)
//     if (!isValue) return alert('please check your inputs!')

//     // ! Bundler
//     const tagKeywordFormat = tagKeyword.trim().charAt(0).toUpperCase() + tagKeyword.trim().slice(1).toLowerCase();
//     // console.log('keywordFormat', tagKeywordFormat)
//     let matchedTag = allTags.find((item) => item[formName] === tagKeywordFormat)
//     // console.log('matchedTag', matchedTag)
//     if (!matchedTag) {
//         matchedTag = { ...newTag, [formName]: tagKeywordFormat, id: 'zero' }
//     }
//     // ! Update newTagData
//     setTagPackage([...tagPackage, matchedTag])
//     // ! Clear Inputs
//     setNewTag(initialTagState)
//     setFilteredTags([])
// }

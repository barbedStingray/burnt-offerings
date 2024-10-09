
// ensures that values are present in all fields for objects...
const handleValueIsPresent = (checkValues) => {

    const checkValueArray = Object.values(checkValues)
    const values = checkValueArray.map((value) => {
        return value !== ''
    })

    if(values.includes(false)) {
        alert('please fill in all the necessary values')
        return false
    }
    return true
}
export default handleValueIsPresent
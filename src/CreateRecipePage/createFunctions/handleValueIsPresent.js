
// ensures that values are present in all fields...

// const handleValueIsPresent = (...checkValues) => {
const handleValueIsPresent = (checkValues) => {

    const checkValueArray = Object.values(checkValues)
    // console.log('checkValueArray', checkValueArray)

    const values = checkValueArray.map((value) => {
        // console.log('VALUE', value)
        // console.log('VALUE RETURN', value !== '')
        return value !== ''
    })
    // console.log('RETURN VALUES', values)
    // console.log('does the value include false?', values.includes(false))

    if(values.includes(false)) {
        alert('please fill in all the necessary values')
        return false
    }
    return true
    // return values.includes(false) ? false : true

}
export default handleValueIsPresent
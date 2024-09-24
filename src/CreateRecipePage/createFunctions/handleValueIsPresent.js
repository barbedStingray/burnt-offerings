
// ensures that values are present in all fields...
const handleValueIsPresent = (...checkValues) => {
    const values = checkValues.map((value) => value !== '')
    if (values.includes(false)) return false
    return true
}
export default handleValueIsPresent
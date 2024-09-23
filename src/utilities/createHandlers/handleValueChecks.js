const handleValueChecks = (...checkValues) => {
    const values = checkValues.map((value) => value !== '')
    if (values.includes(false)) return false
    return true
}
export default handleValueChecks
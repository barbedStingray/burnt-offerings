
// for objects... createDetails, ingredients...
const handleDetailChange = (e, object, setFunction) => {
    console.log('handleDetailChange', object)
    const { name, value } = e.target
    console.log('handleDetailChange', name, value)
    setFunction({ ...object, [name]: value })
}
export default handleDetailChange
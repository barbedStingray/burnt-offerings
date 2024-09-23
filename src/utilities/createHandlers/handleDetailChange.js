
// for objects... recipeDetails, ingredients...
const handleDetailChange = (e, object, setFunction) => {
    console.log('handleDetailChange', object)
    const { name, value } = e.target
    setFunction({ ...object, [name]: value }) // setting it properly
}
export default handleDetailChange
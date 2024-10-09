
// for objects... 
const handleDetailChange = (e, object, setFunction) => {
    const { name, value } = e.target
    setFunction({ ...object, [name]: value })
}
export default handleDetailChange

// creates the dropdown menu of options

const handleSearchDetailChange = (e, setNewValue, searchList, setSearchAttribute, setFilteredTags) => {
    console.log('handleSearchDetailChange', e.target.value)

    const [id, attribute] = Object.keys(searchList[0]) // ! will not use id...
    setSearchAttribute(attribute)
    console.log('attribute', attribute)

    console.log('typeOf', typeof(e.target.value))
    const searchQuery = e.target.value.toLowerCase()
    setNewValue(e.target.value)

    if (searchQuery.length === 0) {
        setFilteredTags([])
    } else {
        const filtered = searchList.filter((item) => item[attribute].toLowerCase().includes(searchQuery))
        // console.log('filter', filtered)

        const sortedFiltered = filtered.sort((a, b) => {
            // console.log(a, b)
            const startsWithQueryA = a[attribute].toLowerCase().startsWith(searchQuery)
            // console.log('startsWithQueryA', startsWithQueryA)
            const startsWithQueryB = b[attribute].toLowerCase().startsWith(searchQuery)
            // console.log('startsWithQueryB', startsWithQueryB)
            if (startsWithQueryA && !startsWithQueryB) return -1
            if (!startsWithQueryA && startsWithQueryB) return 1
            return 0
        })
        setFilteredTags(sortedFiltered)
    }
}
export default handleSearchDetailChange
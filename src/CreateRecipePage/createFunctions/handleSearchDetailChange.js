    import handleDetailChange from "./handleDetailChange"
    

    // creates the dropdown menu of options
    const handleSearchDetailChange = (e, object, setObjectFunction, searchList, setSearchAttribute, setFilteredTags) => {
        const { name, value } = e.target
        const maxItemReturn = 6
        setSearchAttribute(name)
        const searchQuery = value.toLowerCase()

        // Set the new Object
        handleDetailChange(e, object, setObjectFunction)

        // search and filter results
        if (searchQuery.length === 0) {
            setFilteredTags([])
        } else {
            const filtered = searchList.filter((item) => item[name].toLowerCase().includes(searchQuery))
            const sortedFiltered = filtered.sort((a, b) => {
                const startsWithQueryA = a[name].toLowerCase().startsWith(searchQuery)
                const startsWithQueryB = b[name].toLowerCase().startsWith(searchQuery)
                if (startsWithQueryA && !startsWithQueryB) return -1
                if (!startsWithQueryA && startsWithQueryB) return 1
                return 0
            })
            const limitedFilter = sortedFiltered.slice(0, maxItemReturn)
            setFilteredTags(limitedFilter)
        }
    }
    export default handleSearchDetailChange

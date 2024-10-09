import { useState, useEffect, useRef } from 'react';



const useDebounce = (keywords, setCurrentPage) => {
    const debounceTimoutRef = useRef(null) // delay in db request
    const [bouncedKeywords, setBouncedKeywords] = useState('')


    useEffect(() => {
        if (debounceTimoutRef.current) {
            clearTimeout(debounceTimoutRef.current)
        }
        debounceTimoutRef.current = setTimeout(() => {
            setBouncedKeywords(keywords)
            console.log('bounce')
            setCurrentPage(1)
            // trigger animation
        }, 1000)

        return () => {
            clearTimeout(debounceTimoutRef.current)
        }

    }, [keywords])

    return bouncedKeywords
}

export default useDebounce

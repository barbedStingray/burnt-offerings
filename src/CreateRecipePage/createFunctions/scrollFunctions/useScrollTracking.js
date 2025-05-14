// useScrollTracking.js
import { useEffect, useState } from 'react'


const useScrollTracking = (ref) => {
    const [scrollIndex, setScrollIndex] = useState(0)

    useEffect(() => {
        const currentRef = ref.current

            const handleScroll = () => {
                const formWidth = ref.current.clientWidth
                const currentScroll = ref.current.scrollLeft
                const newIndex = Math.round(currentScroll / formWidth)
                setScrollIndex(newIndex)
            }

            currentRef.addEventListener('scroll', handleScroll)
            // Cleanup function
            return () => {
                currentRef.removeEventListener('scroll', handleScroll)
            }
    }, [ref])

    return scrollIndex
}


export default useScrollTracking





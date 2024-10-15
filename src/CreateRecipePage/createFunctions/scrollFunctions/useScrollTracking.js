// useScrollTracking.js
import { useEffect, useState } from 'react'


const useScrollTracking = (ref, isLoaded = true) => {
    const [scrollIndex, setScrollIndex] = useState(0)

    useEffect(() => {
        if (isLoaded && ref.current) {
            const handleScroll = () => {
                const formWidth = ref.current.clientWidth
                const currentScroll = ref.current.scrollLeft
                const newIndex = Math.round(currentScroll / formWidth)
                setScrollIndex(newIndex)
            }
            const currentRef = ref.current
            currentRef.addEventListener('scroll', handleScroll)
            // Cleanup function
            return () => {
                currentRef.removeEventListener('scroll', handleScroll)
            }
        }
    }, [ref, isLoaded])
    return scrollIndex
}


export default useScrollTracking





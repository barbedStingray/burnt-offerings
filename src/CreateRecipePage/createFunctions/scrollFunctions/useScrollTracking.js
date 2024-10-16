// useScrollTracking.js
import { useEffect, useState } from 'react'


const useScrollTracking = (ref, isLoaded = true) => {
    const [scrollIndex, setScrollIndex] = useState(0)
    // console.log('ref', ref)

    useEffect(() => {
        const currentRef = ref.current

        if (isLoaded) {
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
        }
    }, [ref, isLoaded])

    return scrollIndex
}


export default useScrollTracking





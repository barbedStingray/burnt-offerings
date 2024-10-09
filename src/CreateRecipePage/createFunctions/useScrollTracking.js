// useScrollTracking.js
import { useEffect, useState } from 'react';

const useScrollTracking = (ref) => {
    const [formIndex, setFormIndex] = useState(0)

    useEffect(() => {
        const handleScroll = () => {
            const formWidth = ref.current.clientWidth;
            const currentScroll = ref.current.scrollLeft;
            const newIndex = Math.round(currentScroll / formWidth)
            setFormIndex(newIndex)
        };
        const currentRef = ref.current;
        currentRef.addEventListener('scroll', handleScroll)
        // Cleanup function
        return () => {
            currentRef.removeEventListener('scroll', handleScroll)
        };
    }, [ref])
    return formIndex
};

export default useScrollTracking



    // SCROLL effects... OLD from CreateNewRecipe.jsx
    // useEffect(() => {
    //     // picking up my formIndex for scroll
    //     const handleScroll = () => {
    //         const formWidth = formContainerRef.current.clientWidth
    //         const currentScroll = formContainerRef.current.scrollLeft
    //         const newIndex = Math.round(currentScroll / formWidth)
    //         setFormIndex(newIndex)
    //     }
    //     formContainerRef.current.addEventListener('scroll', handleScroll)
    //     // cleanup function
    //     return () => {
    //         if (formContainerRef.current) {
    //             formContainerRef.current.removeEventListener('scroll', handleScroll)
    //         }
    //     }
    // }, [])


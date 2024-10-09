
const scrollToForm = (formIndex, formContainerRef) => {
    console.log('scrolling to', formIndex)
    const formWidth = formContainerRef.current.clientWidth // set width
    formContainerRef.current.scrollTo({
        left: formWidth * formIndex, // scroll to correct position
        behavior: 'smooth'
    })
}
export default scrollToForm

const scrollToForm = (scrollIndex, formContainerRef) => {
    console.log('scrolling to', scrollIndex)
    const formWidth = formContainerRef.current.clientWidth // set width
    formContainerRef.current.scrollTo({
        left: formWidth * scrollIndex, // scroll to correct position
        behavior: 'smooth'
    })
}
export default scrollToForm
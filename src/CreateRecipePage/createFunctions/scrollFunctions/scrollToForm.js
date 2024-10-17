
const scrollToForm = (scrollIndex, ref) => {
    const formWidth = ref.current.clientWidth // set width
    ref.current.scrollTo({
        left: formWidth * scrollIndex, // scroll to correct position
        behavior: 'smooth'
    })
}
export default scrollToForm
const childAnimation = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeInOut" } },
    exit: { opacity: 0, y: 20, transition: { duration: 0.5, ease: "easeInOut" } }
}
export default childAnimation
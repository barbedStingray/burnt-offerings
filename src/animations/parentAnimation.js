const parentAnimation = {
    initial: { opacity: 0, transition: { duration: 0.5, ease: 'easeInOut' } },
    animate: {
        opacity: 1,
        transition: {
            duration: 0.3,
            ease: "easeInOut",
            staggerChildren: 0.1,
            delayChildren: 0.2
        },
    },
    exit: { opacity: 0, transition: { duration: 0.3, ease: "easeInOut" } }
}

export default parentAnimation
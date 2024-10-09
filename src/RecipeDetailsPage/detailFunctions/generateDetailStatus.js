export default function generateDetailStatus(detailStatus) {
    switch(detailStatus) {
        case 'loading':
            return (
                <p>Loading...</p>
            )
        case 'error':
            return (
                <p>ERROR LOADING RECIPE, might not exist...</p>
            )
        default:
            return null
    }
}

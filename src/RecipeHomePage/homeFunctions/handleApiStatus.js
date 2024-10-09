// * ONE FUNCTION: Display apiStatus

export default function handleApiStatus(apiString) {
    switch (apiString) {
        case 'working':
            return (
                <p>Api is loading</p>
            )
        case 'error':
            return (
                <p>Api ERROR</p>
            )
        default:
            return null
    }
}

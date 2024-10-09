

export default function generatePostModal(activeString) {
    switch (activeString) {
        case 'loading':
            return <div>
                <h1>recipe is loading</h1>
            </div>
        case 'success':
            return <div>
                <h1>recipe success!</h1>
            </div>
        case 'error':
            return <div>
                <h1>recipe error</h1>
            </div>
        default:
            return ''
    }
}


// !! OLD needs REFACTOR
export default function generatePostModal(activeString) {
    switch (activeString) {
        case 'ready':
            return <div>
                <h1>Create that Recipe!</h1>
            </div>
        case 'loading':
            return <div>
                <h1>recipe success!</h1>
            </div>
        case 'success':
            return <div>
                <h1>recipe error</h1>
            </div>
        case 'error':
            return <div>
                <h1>recipe error</h1>
            </div>
        default:
            return ''
    }
}

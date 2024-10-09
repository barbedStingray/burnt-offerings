import { Link } from 'react-router-dom'

export default function generateDeleteModal(deleteStatus, setDeleteModal) {

    switch(deleteStatus) {
        case 'working':
            return (
                <div>
                    <p>Deleting your Recipe</p>

                </div>
            )
        case 'success':
            return (
                <div>
                    <p>SUCCESS in deleting</p>
                    <Link to={`/`}><p>Great!</p></Link>
                </div>
            )
        case 'error':
            return (
                <div>
                    <p>ERROR in deleting</p>
                    <div onClick={() => setDeleteModal(false)}>Aww Man...</div>
                </div>
            )
        default:
            return null
    }
}

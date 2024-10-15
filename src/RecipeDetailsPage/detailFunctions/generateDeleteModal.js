import { Link } from 'react-router-dom'
import { GiGingerbreadMan } from 'react-icons/gi'

export default function generateDeleteModal(deleteStatus, setDeleteStatus) {
    switch (deleteStatus) {
        case 'loading':
            return (
                <div className='deleteModalFrame'>
                    <div className='deleteModal'>
                        <p>Deleting your Recipe</p>
                        <div className="homeApiStatus detailsApiStatus">
                            <GiGingerbreadMan />
                        </div>
                    </div>
                </div>
            )
        case 'success':
            return (
                <div className='deleteModalFrame'>
                    <div className='deleteModal'>
                        <p>SUCCESS in deleting</p>
                        <Link className='fireButton medFire deleteHome' to={`/`}><p></p></Link>
                    </div>
                </div>

            )
        case 'error':
            return (
                <div className='deleteModalFrame'>
                    <div className='deleteModal'>
                        <p>ERROR in deleting</p>
                        <button className='createAddButton' onClick={() => setDeleteStatus('')}>Return</button>
                    </div>
                </div>

            )
        default:
            return null
    }
}

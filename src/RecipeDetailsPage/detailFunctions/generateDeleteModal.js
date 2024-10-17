import { Link } from 'react-router-dom'
import { GiGingerbreadMan } from 'react-icons/gi'

export default function generateDeleteModal(deleteStatus, setDeleteStatus) {
    switch (deleteStatus) {
        case 'loading':
            return (
                <div className='modalFrame'>
                    <div className='modalContents'>
                        <p>Deleting your Recipe...</p>
                        <div className="homeApiStatus detailsApiStatus">
                            <GiGingerbreadMan />
                        </div>
                    </div>
                </div>
            )
        case 'success':
            return (
                <div className='modalFrame'>
                    <div className='modalContents'>
                        <h3>Successfully Deleted!</h3>
                        <Link className='fireButton deleteHome' to={`/`}><p></p></Link>
                    </div>
                </div>

            )
        case 'error':
            return (
                <div className='modalFrame'>
                    <div className='modalContents'>
                        <h4>Error encountered!</h4>
                        <button className='basicButton' onClick={() => setDeleteStatus('')}>Return</button>
                    </div>
                </div>

            )
        default:
            return null
    }
}

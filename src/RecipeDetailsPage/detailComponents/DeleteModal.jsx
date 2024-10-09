import React from 'react'
import generateDeleteModal from '../detailFunctions/generateDeleteModal'


const DeleteModal = ({ editPackage }) => {
    const { deleteModal, setDeleteModal, deleteStatus } = editPackage

    return (
        <div>
            {deleteModal && (
                <div className='deleteModal'>
                    <p>This is the Delete Modal</p>
                    {generateDeleteModal(deleteStatus, setDeleteModal)}
                </div>
            )}

        </div>
    )
}

export default DeleteModal

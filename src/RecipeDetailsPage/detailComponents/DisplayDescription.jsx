import React from 'react'
import EditTheDetail from '../../components/EditTheDetail'

const DisplayDescription = ({ editPackage, detailPackage }) => {

    const { letsEdit, refresh, setRefresh } = editPackage
    const { displayId, description } = detailPackage


    return (
        <div className='detailsDescriptionParts'>
            <EditTheDetail
                category={{ type: 'description', detail: description, target_id: displayId }}
                editPackage={{ letsEdit, refresh, setRefresh }}
            />
        </div>
    )
}

export default DisplayDescription

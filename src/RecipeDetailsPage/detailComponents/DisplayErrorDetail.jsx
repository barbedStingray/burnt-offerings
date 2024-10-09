import React from 'react'
import generateDetailStatus from '../detailFunctions/generateDetailStatus'


const DisplayErrorDetail = ({ detailStatus }) => {

    return (
        <div>
            <p>Waiting Room</p>
            {generateDetailStatus(detailStatus)}
        </div>
    )
}

export default DisplayErrorDetail

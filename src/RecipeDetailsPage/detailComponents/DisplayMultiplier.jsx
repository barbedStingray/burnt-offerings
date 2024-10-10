import React from 'react'


const DisplayMultiplier = ({ multiplier, setMultiplier }) => {

    return (
        <div className='detailsMultiplier'>
            <p className='lineThrough'></p>
            <div className={`multiplyBtn ${multiplier == 0.5 ? 'activateMultiply' : ''}`} onClick={() => setMultiplier(0.5)}>1/2x</div>
            <div className={`multiplyBtn ${multiplier == 1 ? 'activateMultiply' : ''}`} onClick={() => setMultiplier(1)}>1x</div>
            <div className={`multiplyBtn ${multiplier == 2 ? 'activateMultiply' : ''}`} onClick={() => setMultiplier(2)}>2x</div>
        </div>
    )
}

export default DisplayMultiplier

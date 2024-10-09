import React from 'react'


const DisplayMultiplier = ({ setMultiplier }) => {

    
    return (
        <div>
            <p>Multiply Your Recipe</p>
            <div onClick={() => setMultiplier(0.5)}>0.5x</div>
            <div onClick={() => setMultiplier(1)}>1x</div>
            <div onClick={() => setMultiplier(2)}>2x</div>
        </div>
    )
}

export default DisplayMultiplier

import React from 'react'
import { Link } from 'react-router-dom'
import './FourOhFour.css'

const FourOhFour = () => {

    return (
        <div className='FourOhFour'>
                <h1>Uh Oh!</h1>
                <p>This Page Does Not Exist!</p>
                <Link to={'/'} className='fireButton deleteHome'></Link>
        </div>
    )
}

export default FourOhFour

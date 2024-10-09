import React from 'react'
import { Link } from 'react-router-dom'
import { LiaCookieBiteSolid } from "react-icons/lia";


const CreateNav = () => {
    return (
        <div className='createNavigation'>
            <div className='createNavigationParts'>
                <Link className='createHomeButton' to={'/'}><LiaCookieBiteSolid /></Link>
            </div>
            <div className='createLogoParts'>
                <div className='createMomPhoto'></div>
                <div className='createStingrayLogo'>Logo</div>
            </div>
        </div>
    )
}

export default CreateNav

import React from 'react'
import { Link } from 'react-router-dom'

import { LiaCookieBiteSolid } from "react-icons/lia";
import { PiPencilThin } from "react-icons/pi";



const DetailNav = ({ editPackage }) => {
    const { letsEdit, setLetsEdit } = editPackage

    return (
        <div className='detailNavigation'>
            <div className='detailNavigationParts'>
                <Link to={`/`} className='detailHomeButton'><LiaCookieBiteSolid /></Link>
                <div className={`detailHomeButton ${letsEdit && 'activeMode'}`} onClick={() => setLetsEdit(!letsEdit)}><PiPencilThin /></div>
            </div>
            <div className='detailLogoParts'>
                <div className='detailMomPhoto'></div>
                <div className='detailStingrayLogo'>Logo</div>
            </div>
        </div>
    )
}

export default DetailNav

import React from 'react'
import { Link } from 'react-router-dom'

import { LiaCookieBiteSolid } from "react-icons/lia";
import { PiPencilThin } from "react-icons/pi";
import { IoIosArrowDropleft } from "react-icons/io";

import scrollToForm from '../../CreateRecipePage/createFunctions/scrollFunctions/scrollToForm';



const DetailNav = ({ editPackage }) => {
    const { letsEdit, setLetsEdit, horizontalScrollRef } = editPackage

    return (
        <div className='detailNavigation'>
            <div className='detailNavigationParts'>
                <Link to={`/`} className='detailHomeButton'><LiaCookieBiteSolid /></Link>
                <div className={`detailHomeButton ${letsEdit && 'activeMode'}`} onClick={() => setLetsEdit(!letsEdit)}><PiPencilThin /></div>
                <div className='detailHomeButton' onClick={() => scrollToForm(0, horizontalScrollRef)}><IoIosArrowDropleft /></div>

            </div>
            <div className='detailLogoParts'>
                <div className='detailMomPhoto'></div>
                <div className='detailStingrayLogo'>Logo</div>
            </div>
        </div>
    )
}

export default DetailNav

import React from 'react'
import { Link } from 'react-router-dom'
import stingray from '../images/stingray.png'

import scrollToForm from '../CreateRecipePage/createFunctions/scrollFunctions/scrollToForm';

import { CiCirclePlus } from "react-icons/ci";
import { LiaCookieBiteSolid } from "react-icons/lia";
import { PiPencilThin } from "react-icons/pi";
import { IoIosArrowDropleft } from "react-icons/io";



const HomeNav = ({ navPackage }) => {
    const {
        section,
        letsEdit = false,
        setLetsEdit = () => { },
        setAddMoreView = () => { },
        horizontalScrollRef = null
    } = navPackage

    
    const navigationLinks = {
        home: '/createRecipe',
        create: '/',
        details: '/',
    }
    
    const navigationIcons = {
        home: <CiCirclePlus />,
        create: <LiaCookieBiteSolid />,
        details: <LiaCookieBiteSolid />
    }
    const navPath = navigationLinks[section]

    const noNav = section !== 'details' ? 'noNav' : ''


    return (
        <div className='navBar'>

            <div className='navBarParts'>
                <Link to={navPath} className='navButton'>{navigationIcons[section]}</Link>
                <div
                    className={`navButton ${letsEdit && 'highlightNav'} ${noNav} `}
                    onClick={() => {
                        setLetsEdit(!letsEdit)
                        setAddMoreView('')
                    }}
                ><PiPencilThin />
                </div>
                <div className={`navButton ${noNav}`} onClick={() => scrollToForm(0, horizontalScrollRef)}><IoIosArrowDropleft /></div>
            </div>

            <div className='logoParts'>
                <div className='homeMomPhoto'></div>
                <div className='homeStingrayLogo'>
                    <img className='stingrayImage' src={stingray} alt='stingray photo'/>
                </div>
            </div>

        </div>
    )
}
export default HomeNav

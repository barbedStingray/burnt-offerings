import React from 'react'
import { Link } from 'react-router-dom'
import { CiCirclePlus } from "react-icons/ci";

const HomeNav = () => {
    return (
        <div className='homeNavigation'>
            <div className='homeNavigationParts'>
                <Link to={`/createRecipe`} className='homeAddButton'><CiCirclePlus /></Link>
            </div>
            <div className='homeLogoParts'>
                <div className='homeMomPhoto'></div>
                <div className='homeStingrayLogo'>Logo</div>
            </div>
        </div>
    )
}

export default HomeNav

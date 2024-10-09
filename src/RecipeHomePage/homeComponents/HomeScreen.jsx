import React from 'react'

import handleApiStatus from '../homeFunctions/handleApiStatus';

import { TbCookieMan } from "react-icons/tb";
import { LiaCookieBiteSolid } from "react-icons/lia";
import { GiPumpkinLantern } from "react-icons/gi";

const HomeScreen = ({ apiSearching }) => {


    return (
        <div className='homeNoRecipes'>
            <p className='homeNoRecipeText'>Search Recipes!</p>
            <div className='homeNoCookieMan'><GiPumpkinLantern /></div>
            <div>{handleApiStatus(apiSearching)}</div>
        </div>
    )
}

export default HomeScreen

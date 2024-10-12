import React from 'react'


import { TbCookieMan } from "react-icons/tb";
import { LiaCookieBiteSolid } from "react-icons/lia";
import { GiPumpkinLantern } from "react-icons/gi";

const HomeScreen = () => {
    

    // todo ! switch icons based on holidays? 
    
    
    return (
        <div className='homeNoRecipes'>
            <p className='homeNoRecipeText'>Search Recipes!</p>
            <div className='homeDisplayIcon'><GiPumpkinLantern /></div>
        </div>
    )
}

export default HomeScreen

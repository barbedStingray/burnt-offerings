import React from 'react'
import { motion as m } from 'framer-motion'
import basicAnimation from '../../animations/basicAnimation';


import { TbCookieMan } from "react-icons/tb";
import { LiaCookieBiteSolid } from "react-icons/lia";
import { GiPumpkinLantern } from "react-icons/gi";

const HomeScreen = () => {


    // todo ! switch icons based on holidays? 


    return (
        <m.div
            className='searchHome'
            key="searchHome"
            variants={basicAnimation}
            initial="initial"
            animate="animate"
            exit="exit"
        >
            <p className='searchHomeText'>Search Recipes!</p>
            <div className='searchHomeIcon'><GiPumpkinLantern /></div>
        </m.div>
    )
}

export default HomeScreen

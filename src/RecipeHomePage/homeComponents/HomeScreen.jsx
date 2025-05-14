import React from 'react'
import { motion as m } from 'framer-motion'
import basicAnimation from '../../animations/basicAnimation';


import { GiPumpkinLantern } from "react-icons/gi";
import { BsSnow2 } from "react-icons/bs";
import { GiFlowerPot } from "react-icons/gi";
import { GiWheat } from "react-icons/gi";
import { GiBunnySlippers } from "react-icons/gi";
import { GiIsland } from "react-icons/gi";
import { GiBoatHorizon } from "react-icons/gi";
import { GiPineTree } from "react-icons/gi";
import { GiPineapple } from "react-icons/gi";
import { PiCloverLight } from "react-icons/pi";
import { GiCornucopia } from "react-icons/gi";
import { SiAdafruit } from "react-icons/si";



const HomeScreen = () => {


    const holidayIcons = {
        0: <GiPineapple />, 
        1: <GiPineTree />, 
        2: <PiCloverLight />, 
        3: <GiFlowerPot />, 
        4: <GiIsland />, 
        5: <GiBoatHorizon />, 
        6: <SiAdafruit />, 
        7: <GiWheat />, 
        8: <GiBunnySlippers />, 
        9: <GiPumpkinLantern />, 
        10: <GiCornucopia />,
        11: <BsSnow2 /> 
    }

    function getIconByMonth() {
        const month = new Date().getMonth()
        const holiday = holidayIcons[month]
        return holiday ? holidayIcons[month] : null
    }
  

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
            <div className='searchHomeIcon'>{getIconByMonth()}</div>
        </m.div>
    )
}

export default HomeScreen


import { GiFishbone } from "react-icons/gi";
import { GiRawEgg } from "react-icons/gi";
import { GiSandwich } from "react-icons/gi";
import { GiFruitBowl } from "react-icons/gi";
import { GiHotMeal } from "react-icons/gi";


export default function noIconPhoto(iconString) {
    switch (iconString) {
        case 'dinner':
            return <GiHotMeal />
        case 'egg':
            return <GiRawEgg />
        case 'fish':
            return <GiFishbone />
        case 'lunch':
            return <GiSandwich />
        case 'snack':
            return <GiFruitBowl />
        default:
            return null
    }
}

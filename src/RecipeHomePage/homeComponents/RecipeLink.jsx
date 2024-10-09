import React from 'react'
import { Link } from 'react-router-dom'

import noIconPhoto from '../../components/noIconPhoto';
import { FaInfo } from "react-icons/fa";
import { LuAlarmClock } from "react-icons/lu";


const RecipeLink = ({ recipe }) => {
    const { id, title, prep_time, servings, picture } = recipe


    const generateHomeImage = () => {
        const imageOptions = {
            http: <img className='mosaicPhoto' src={picture} alt={title} />,
            default: <p className='homeGeneratedIcon'>{noIconPhoto(picture)}</p>
        }
        return imageOptions[picture?.startsWith('http') ? 'http' : 'default']
    }

    return (
        <Link
            key={id}
            to={`/recipeDetails/${id}`}
            className='recipeContainer'
        >

            <div className='recipeMosaicPhoto'>
                {generateHomeImage()}
            </div>

            <div className='cardDisplay'>
                <div className='cardDetails'>
                    <p className='homeRecipeTitle'>{title}</p>
                    <p className='homeDetail'><span className='homeIconDetail'><FaInfo /></span>{servings}</p>
                    <p className='homeDetail'><span className='homeIconDetail'><LuAlarmClock /></span>{prep_time}</p>
                </div>
            </div>
            
        </Link>
    )
}

export default RecipeLink

import React from 'react'
import { Link } from 'react-router-dom'

import generatePhoto from '../../renderImage/generatePhoto'


const RecipeLink = ({ recipe }) => {
    const { id, title, picture } = recipe


    const generateHomeImage = () => {
        const imageOptions = {
            http: <img className='mosaicPhoto' src={picture} alt={title} />,
            default: <p className='homeGeneratedIcon'>{generatePhoto(picture)}</p>
        }
        return imageOptions[picture?.startsWith('http') ? 'http' : 'default']
    }

    return (
        <div
            // key={id}
            // to={`/recipeDetails/${id}`}
            className='recipeLink'
        >

            <div className='recipeMosaicPhoto' 
            >
                {generateHomeImage()}
            </div>

            <div className='cardDisplay'>
                <p className='homeRecipeTitle'>{title}</p>
            </div>
        </div>
    )
}

export default RecipeLink

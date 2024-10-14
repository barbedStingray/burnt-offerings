import React from 'react'
import { Link } from 'react-router-dom'

import noIconPhoto from '../../components/noIconPhoto';


const RecipeLink = ({ recipe }) => {
    const { id, title, picture } = recipe


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
            className='recipeLink'
        >

            <div className='recipeMosaicPhoto' 
            >
                {generateHomeImage()}
            </div>

            <div className='cardDisplay'>
                <p className='homeRecipeTitle'>{title}</p>
            </div>
        </Link>
    )
}

export default RecipeLink

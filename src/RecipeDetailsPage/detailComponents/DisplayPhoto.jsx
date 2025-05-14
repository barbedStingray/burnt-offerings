import React from 'react'
import axios from 'axios'
import ImageUpload from '../../renderImage/ImageUpload'
import generatePhoto from '../../renderImage/generatePhoto'
import { useDispatch } from 'react-redux'


const DisplayPhoto = ({ editPackage, detailPackage }) => {
    const dispatch = useDispatch()
    const { letsEdit } = editPackage
    const { displayId, picture, recipeID } = detailPackage


    const addCustomPhoto = async (properties) => {
        // console.log('adding new photo properties:', properties)
        try {
            await axios.put(`/api/recipes/putNewPhoto/${displayId}`, { data: { properties } })

            const results = await axios.get(`/api/recipes/details/${recipeID}`)
            const { mainRecipe, subRecipes, parentRecipes } = results.data
            dispatch({ type: 'SET_RECIPE', payload: { mainRecipe, subRecipes, parentRecipes }})
    
        } catch (error) {
            console.log('error in changing photo', error)
            alert('Sorry, your photo didnt make it!')
        }
    }


    return (
        <div className='detailsPhotoContainer'>
            {letsEdit ? (
                <ImageUpload photoFunction={addCustomPhoto} recipeImage={picture} />
            ) : (
                <>
                    {picture.startsWith('http') ? (
                        <img className='detailsPhoto' src={picture} />
                    ) : (
                        <p className='detailGeneratedIcon'>{generatePhoto(picture)}</p>
                    )}
                </>
            )}
        </div>
    )
}

export default DisplayPhoto

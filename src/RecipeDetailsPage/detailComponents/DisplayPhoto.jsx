import React from 'react'
import axios from 'axios'
import ImageUpload from '../../renderImage/ImageUpload'
import generatePhoto from '../../renderImage/generatePhoto'


const DisplayPhoto = ({ editPackage, detailPackage }) => {
    const { letsEdit, refresh, setRefresh } = editPackage
    const { displayId, picture } = detailPackage



    const addCustomPhoto = async (properties) => {
        console.log('adding new photo properties:', properties)
        try {
            await axios.put(`/api/recipes/putNewPhoto/${displayId}`, { data: { properties } })
            setRefresh(!refresh)
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

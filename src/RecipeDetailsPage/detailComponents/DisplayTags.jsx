import React from 'react'
import { useDispatch } from 'react-redux'
import deleteSoloDetail from '../detailFunctions/deleteSoloDetail'


const DisplayTags = ({ editPackage, detailPackage }) => {

    const dispatch = useDispatch()
    const { letsEdit } = editPackage
    const { tags, setAddMoreView, recipeID } = detailPackage


    return (
        <div className='tagDetails'>
            <div className='viewTags'>
                {tags.map((tag, i) => (
                    <p
                        key={i}
                        onClick={letsEdit ? (() => deleteSoloDetail('tag', tag.delete_id, recipeID, dispatch)) : null}
                    >
                        {tag.tag}{letsEdit && ' X'}
                    </p>
                ))}
            </div>
            <div className='addDetailButton'>
                {letsEdit && (
                    <button className='fireButton addFire' onClick={() => setAddMoreView('tag')}></button>
                )}
            </div>

        </div>
    )
}

export default DisplayTags

import React from 'react'
import deleteSoloDetail from '../detailFunctions/deleteSoloDetail'


const DisplayTags = ({ editPackage, detailPackage }) => {
    const { letsEdit, refresh, setRefresh } = editPackage
    const { tags, setAddMoreView } = detailPackage


    return (
        <div className='tagDetails'>
            <div className='viewTags'>
                {tags.map((tag, i) => (
                    <p
                        key={i}
                        onClick={letsEdit ? (() => deleteSoloDetail('tag', tag.delete_id, refresh, setRefresh)) : null}
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

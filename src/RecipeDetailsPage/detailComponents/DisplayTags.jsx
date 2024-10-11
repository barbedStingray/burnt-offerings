import React from 'react'
import deleteSoloDetail from '../../components/deleteSoloDetail'


const DisplayTags = ({ editPackage, detailPackage }) => {
    const { letsEdit, refresh, setRefresh } = editPackage
    const { tags, setEditView } = detailPackage


    return (
        <div className='tagDetails'>

            <div className='addDetailButton'>
                {letsEdit && (
                    <button className='fireButton addFire' onClick={() => setEditView('tag')}></button>
                )}
            </div>
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
        </div>
    )
}

export default DisplayTags

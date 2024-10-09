import React from 'react'
import deleteSoloDetail from '../../components/deleteSoloDetail'


const DisplayTags = ({ editPackage, detailPackage }) => {
    const { letsEdit, refresh, setRefresh } = editPackage
    const { tags, setEditView } = detailPackage


    return (
        <div className='tagDetails'>
            {tags.map((tag, i) => (
                <p
                    key={i}
                    onClick={letsEdit ? (() => deleteSoloDetail('tag', tag.delete_id, refresh, setRefresh)) : null}
                >
                    {tag.tag}{letsEdit && ' X'}
                </p>
            ))}
            {letsEdit && (
                <button onClick={() => setEditView('tag')}>Add Tags</button>
            )}
        </div>
    )
}

export default DisplayTags

import React, { useState } from 'react'



const IngredientEdit = ({ ingredient, target_id, letsEdit }) => {


    const [editModule, setEditModule] = useState(false)
    const [editString, setEditString] = useState(ingredient)

    async function putIngredientEdit(editString) {
        console.log('sending new ingredient edit', editString)

        const isValue = editString.length > 0
        console.log('isValue', isValue)
        if (!isValue) return alert('No empty values please')
        // todo format
        // todo check for ingredient id if ingredient already exists
        // todo update in db / add new ingredient if it's changed
        // todo you're changing the ingredient_id to a newid AT the target_id

    }

    return (
        <div>
            {editModule ? (
                <>
                {/* // ! Same input for ingredient */}
                            <input // having this input outside the loop mattered when it came to handling events...
                                name='ingredient'
                                className='createFormInput' // might need a new edit classname here
                                type='text'
                                placeholder='Add Ingredient'
                                required
                                maxLength={30}
                                minLength={1}
                                autoComplete='off'
                                value={editString}
                                onChange={(e) => setEditString(e.target.value)}
                            >
                            </input>
                    <button onClick={() => putIngredientEdit(editString)}>Save</button>
                    <button onClick={() => setEditModule(false)}>Cancel</button>
                </>
            ) : (
                <p onClick={letsEdit ? () => setEditModule(true) : null}>{ingredient}</p>
            )}

        </div>
    )
}

export default IngredientEdit

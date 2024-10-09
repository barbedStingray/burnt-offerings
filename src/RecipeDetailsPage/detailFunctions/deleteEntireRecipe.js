import axios from 'axios'


const deleteEntireRecipe = async (id, setDeleteModal, setDeleteStatus) => {
    const isConfirmed = window.confirm('Delete this Recipe?')
    if (!isConfirmed) return
    setDeleteModal(true)
    setDeleteStatus('working')
    try {
        await axios.delete(`/api/recipes/deleteEntireRecipe/${id}`)
        setDeleteStatus('success')
    } catch (error) {
        console.log('ERROR delete entire recipe', id)
        setDeleteStatus('error')
    }
}

export default deleteEntireRecipe

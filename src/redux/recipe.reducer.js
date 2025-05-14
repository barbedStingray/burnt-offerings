const recipe = (state = {}, action) => {
    switch (action.type) {
        case 'SET_RECIPE':
            return action.payload
        default:
            return state
    }
}

export default recipe
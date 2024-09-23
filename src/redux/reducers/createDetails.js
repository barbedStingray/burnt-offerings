
const createDetails = (state = [], action) => {
    switch (action.type) {
      case 'CREATE_RECIPE_DETAILS':
        return action.payload;
      default:
        return state;
    }
  };
  
export default createDetails;
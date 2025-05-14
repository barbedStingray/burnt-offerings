import { combineReducers } from 'redux';
import recipe from './recipe.reducer'

const rootReducer = combineReducers({
    recipe,
});

export default rootReducer;

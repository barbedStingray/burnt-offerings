import { combineReducers } from "redux";

// import your reducer files here
import createDetails from "./reducers/createDetails";


const rootReducer = combineReducers({
    createDetails,
})

// todo Double check to see if this is correct. No dependency arrays?
export default rootReducer
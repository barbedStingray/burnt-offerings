import { combineReducers } from "redux";

// import your reducer files here
// import userProjects from './projects.reducer'
import createDetails from "./reducers/createDetails";


const rootReducer = combineReducers({
    createDetails,
})

export default rootReducer
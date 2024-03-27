import { combineReducers } from "redux"
import userReducer from "./userReducer"

const myReducers = combineReducers({
    user : userReducer
})

export default myReducers
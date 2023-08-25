import authReducer from "./authReducer";

const { combineReducers } = require("redux");

const RootReducer = combineReducers({authReducer:authReducer})

export default RootReducer;
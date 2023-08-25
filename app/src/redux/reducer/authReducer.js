import ACTION_CONSTANTS from '../action/action'
const initialState = {
  loggedIn: false,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_CONSTANTS.LOGIN_SUCCESSFUL:
      return {
        ...state,
        loggedIn: true,
        userData: action.payload,
      };
    case ACTION_CONSTANTS.LOGIN_DATA_UPDATE:
      return {
        ...state,
        userData: action.payload,
      };
    case ACTION_CONSTANTS.LOGIN_FAILED:
      return {...state, loggedIn: false};

    case ACTION_CONSTANTS.RESET_APP:
      return {state: initialState};
    default:
      return state;
  }
};

export default authReducer;

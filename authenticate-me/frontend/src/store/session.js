// frontend/src/store/session.js
import { csrfFetch } from "./csrf";

const SET_USER = 'session/setUser';
const REMOVE_USER = 'session/removeUser';

////////////////////////////////////////////// ACTION

// Set user action
const setUser = (user) => {
    return {
        type: SET_USER,
        payload: user
    }
}

// Remove user action
const removeUser = () => {
    return {
        type: REMOVE_USER
    }
}

///////////////////////////////////////////////// THUNKS

// Login Thunk
export const login = (user) => async (dispatch) => {
    const { credential, password } = user;
    const response = await csrfFetch('/api/session', {
        method: 'POST',
        body: JSON.stringify({
            credential,
            password,
        }),
    });
    const data = await response.json();
    dispatch(setUser(data.user));
    return response;
}






////////////////////////////////////////////////// REDUCER

const initialState = { user: null };

const sessionReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case SET_USER:
            newState = Object.assign({}, state);
            newState.user = action.payload;
            return newState;
        case REMOVE_USER:
            newState = Object.assign({}, state);
            newState.user = null;
            return newState;
        default:
            return state;
    }
}

export default sessionReducer;
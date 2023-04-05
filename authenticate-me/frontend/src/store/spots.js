// frontend/src/store/spots.js
import { csrfFetch } from "./csrf";

const SINGLE_SPOT = 'spots/SINGLE_SPOT';
const USER_SPOTS = 'spots/USER_SPOTS';
const ALL_SPOTS = 'spots/ALL_SPOTS';
const ADD_SPOT = 'spots/ADD_SPOT';
const ADD_PREVIEWIMAGE = 'spots/ADD_PREVIEWIMAGE';
const EDIT_SPOT = 'spots/EDIT_SPOT';
const DELETE_SPOT = 'spots/DELETE_SPOT';

///////////////////////////////////////////////// ACTIONS

export const singleSpot = (spot) => {
    return {
        type: SINGLE_SPOT,
        spot
    }
}

export const userSpots = (spots) => {
    return {
        type: USER_SPOTS,
        spots
    }
}

export const allSpots = (spots) => {
    return {
        type: ALL_SPOTS,
        spots
    }
}

export const addSpot = (spot) => {
    return {
        type: ADD_SPOT,
        spots
    }
}

export const addPrevImg = (spotId, url, preview) => {
    return {
        type: ADD_PREVIEWIMAGE,
        spotId,
        url,
        preview
    }
}

export const editSpot = (spotId, spot) => {
    return {
        type: EDIT_SPOT,
        spotId,
        spot
    }
}

export const deleteSpot = (spotId) => {
    return {
        type: DELETE_SPOT,
        spotId
    }
}

///////////////////////////////////////////////////// THUNKS

export const getSingleSpot = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`)

    if (response.ok) {
        const spot = await response.json();
        dispatch(singleSpot(spot))
        return spot;
    }
}

export const getUsersSpots = () => async (dispatch) => {
    const response = await csrfFetch('/api/spots/current')

    if (response.ok) {
        const spots = await response.json();
        dispatch(allSpots(spots));
        return spots;
    }
}

export const getAllSpots = () => async (dispatch) => {
    const response = await csrfFetch('/api/spots')

    if (response.ok) {
        const spots = await response.json();
        dispatch(allSpots(spots));
        return spots;
    }
}

export const addSpots = (spot) => async (dispatch) => {
    const response = await csrfFetch('/api/spots', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(spot)
    })

    if (response.ok) {
        const spot = await response.json();
        dispatch(addSpot(spot));
        return spot;
    }
}

export const addPreviewImage = (spotId, url, preview) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/images`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            url,
            preview
        })
    })

    if (response.ok) {
        const { spotId, url, preview } = await (response.json());
        dispatch(addPrevImg(+spotId, url, preview));
        return spotId;
    }
}

export const editSpots = (spotId, spot) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(spot)
    })

    if (response.ok) {
        const spot = await response.json();
        dispatch(editSpot(spotId, spot));
        return spot;
    }
}

export const deleteSpots = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'DELETE'
    })

    if (response.ok) {
        const spot = await (response.json());
        dispatch(deleteSpot(+spot.id))
        return spot
    }
}

//////////////////////////////////////////////////////////////// REDUCER

const initialState = {
    spots: {},
    singleSpot: {}
}

const normalize = (spots) => {
    const data = {};
    if (spots.Spots) {
        spots.Spots.forEach(spot => data[spot.id] = spot);
        return data;
    }
}

export default function spotReducer(state = initialState, action) {
    switch (action.type) {
        case ALL_SPOTS: {
            const newState = { ...state }
            newState.spots = normalize(action.spots)
            return newState
        }
        case USER_SPOTS: {
            const newState = { ...state }
            newState.spots = normalize(action.spots)
            return newState
        }
        case SINGLE_SPOT: {
            const newState = { ...state }
            newState.singleSpot = action.spot
            return newState
        }
        case ADD_SPOT: {
            const newState = { ...state }
            newState.spots = { ...state.spots, [action.spot.id]: action.spot }
            return newState
        }
        case ADD_PREVIEWIMAGE: {
            const newState = { ...initialState }
            newState.spots = { ...state.spots, [action.spotId.previewImage]: action.url }
            return newState
        }
        case EDIT_SPOT: {
            const newState = { ...state }
            newState.spots = { ...state.spots, [action.spotId]: action.spot }
            newState.singleSpot = { ...state.singleSpot, ...action.spot }
            return newState
        }
        case DELETE_SPOT: {
            const newState = { ...state }
            delete newState.spots[action.spotId]
            return newState
        }
        default:
            return state
    }
}
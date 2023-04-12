// frontend/src/store/spots.js
import { csrfFetch } from "./csrf";

const SINGLE_SPOT = 'spots/SINGLE_SPOT';
const USERS_SPOTS = 'spots/USERS_SPOTS';
const ALL_SPOTS = 'spots/ALL_SPOTS';
const ADD_SPOT = 'spots/ADD_SPOT';
const ADD_PREIMG = "spots/ADD_PREIMG";
const EDIT_SPOT = 'spots/EDIT_SPOT';
const DELETE_SPOT = 'spots/DELETE_SPOT';



//--------------------------------------------------------------------- ACTIONS

export const singleSpot = (spot) => {
  return {
      type: SINGLE_SPOT,
      spot
  }
}

export const userSpots = (spots) => {
  return {
      type: USERS_SPOTS,
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
      spot
  }
}

export const addPreImg = (spotId, url, preview) => {
  return {
      type: ADD_PREIMG,
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

//--------------------------------------------------------------------- THUNKS

export const getSingleSpot = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`)

  if (res.ok) {
      const spot = await res.json();
      dispatch(singleSpot(spot))
      return spot;
  }
}

export const getUsersSpots = () => async (dispatch) => {
  const res = await csrfFetch("/api/spots/current")

  if (res.ok) {
      const spots = await res.json();
      dispatch(allSpots(spots));
      return spots;
  }
}

export const getAllSpots = () => async (dispatch) => {
  const res = await csrfFetch("/api/spots")
  if (res.ok) {
      const spots = await res.json();
      dispatch(allSpots(spots));
      return spots;
  }
}

export const addSpots = (spot) => async (dispatch) => {
  const res = await csrfFetch("/api/spots", {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(spot)
  })

  if (res.ok) {
      const spot = await res.json();
      dispatch(addSpot(spot));
      return spot;
  }
}

export const addPreviewImg = (spotId, url, preview) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}/images`, {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify({
          url,
          preview
      })
  })

  if (res.ok) {
      const { spotId, url, preview } = await (res.json());
      dispatch(addPreImg(+spotId, url, preview))
      return spotId
  }
}

export const editSpots = (spotId, spot) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`, {
      method: "PUT",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(spot)
  })

  if (res.ok) {
      const spot = await res.json();
      dispatch(editSpot(spotId, spot));
      return spot;
  }
}

export const deleteSpots = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`, {
      method: 'DELETE'
  })

  if (res.ok) {
      const spot = await (res.json());
      dispatch(deleteSpot(+spot.id))
      return spot
  }
}

//--------------------------------------------------------------------- REDUCER


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
      case USERS_SPOTS: {
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
      case ADD_PREIMG: {
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
        return state;
  }
}

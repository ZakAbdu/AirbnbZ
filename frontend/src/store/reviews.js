// frontend/src/store/reviews.js
import { csrfFetch } from "./csrf";

const SPOT_REVIEWS = 'reviews/SPOT_REVIEWS';
const ADD_REVIEW = 'reviews/ADD_REVIEW';
const DELETE_REVIEW = 'reviews/DELETE_REVIEW';

///////////////////////////////////////////////////// ACTIONS

export const spotReviews = (spotId, reviews) => {
    return {
        type: SPOT_REVIEWS,
        spotId,
        reviews
    }
}

export const addReview = (spotId, review) => {
    return {
        type: ADD_REVIEW,
        spotId,
        review
    }
}

export const deleteReview = (reviewId) => {
    return {
        type: DELETE_REVIEW,
        reviewId
    }
}

/////////////////////////////////////////////////////// THUNKS

export const getSpotReviews = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`)

    if (response.ok) {
        const reviews = await response.json();
        dispatch(spotReviews(spotId, reviews));
        return reviews;
    }
}

export const addReviews = (spotId, review) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(review)
    })

    if (response.ok) {
        const review = await response.json();
        dispatch(addReview(spotId, review));
        return review;
    }
}

export const deleteReviews = (reviewId) => async (dispatch) => {
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE'
    })

    if (response.ok) {
        const deletedReview = await response.json();
        dispatch(deleteReview(reviewId));
        return deletedReview;
    }
}

////////////////////////////////////////////////////////////// REDUCER

const initialState = {
    spotReviews: {},
    userReviews: {}
}

const normalize = (reviews) => {
    const data = {};
    reviews.forEach(review => data[review.id] = review);
    return data;
}

export default function reviewsReducer(state = initialState, action) {
    switch (action.type) {
        case SPOT_REVIEWS: {
            const newState = { ...state }
            if (action.reviews.reviews) {
                newState.spotReviews = normalize(action.reviews.reviews)
                return newState
            }
        }
        case ADD_REVIEW: {
            const newState = { ...state }
            newState.spotReviews = { ...state.spotReviews, [action.review.id]: action.review }
            newState.userReviews = { ...state.userReviews, [action.review.id]: action.review }
            return newState
        }
        case DELETE_REVIEW: {
            const newState = { ...state }
            delete newState.spotReviews[action.reviewId]
            delete newState.userReviews[action.reviewId]
            return newState
        }
        default:
            return state
    }
}
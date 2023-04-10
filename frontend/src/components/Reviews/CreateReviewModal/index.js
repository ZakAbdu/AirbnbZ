// frontend/src/components/reviews/create-review-modal/index.js
import React, { useEffect } from "react";
import { useModal } from "../../../context/Modal";
import { useDispatch, useSelector} from "react-redux";
import { useState } from "react";
import { addReviews } from "../../../store/reviews";
import { getSingleSpot } from "../../../store/spots";
import "./CreateReview.css";

export default function CreateReviewModal(spot) {
    spot = spot.spot
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const [review, setReview] = useState('');
    const [stars, setStars] = useState('');
    const [emptyField, setEmptyField] = useState('true')
    const [errors, setErrors] = useState([]);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [hover, setHover] = useState(0);
    const starArr = ["", "", "", "", ""];

    useEffect(() => {
        const valErrors = [];

        if (review.length < 10 || stars < 1) {
            setEmptyField(true);
        } else setEmptyField(false);

        if (review.length < 10) valErrors.push('Review must be more than 10 characters.');
        if (stars < 1) valErrors.push('Rating must be in between 1-5 stars.');
        setErrors(valErrors);
    }, [review, stars]);

    const onSubmit = async (e) => {
        e.preventDefault();

        setHasSubmitted(true);

        if(errors.length > 0) {
            return;
        }

        const newReview = {
            review,
            stars
        }

        const createdReview = await dispatch(addReviews(spot.id, newReview))
        const backToSpot = await dispatch(getSingleSpot(spot.id))

        closeModal();
    }

    return (
        <div className="add-review-div">
            <form className="review-form" onSubmit={onSubmit}>
            <h1 className="form-text form-header">How was your stay?</h1>
            <ul className="errors-list">
                {hasSubmitted && errors.map((error, idx) => (
                    <li key={`error${idx}`} className='errors'>{error}</li>
                ))}
            </ul>
            <textarea
                className="review-textarea"
                placeholder="Leave your review here"
                value={review}
                onChange={(e) => setReview(e.target.value)}
            />
            <div className="rating-review-container">
                {starArr.map((starEl, index) => {
                index++;
                return (
                    <button
                        className="star-button"
                        key={`index${index}`}
                        onClick={(e) => {
                            e.preventDefault();
                            setStars(index)
                        }}
                        onMouseEnter={() => setHover(index)}
                        onMouseLeave={() => setHover(stars)}
                        >
                        <i className={index <= (hover || stars) ? 'fa-solid fa-star star-review' : 'fa-regular fa-star star-review'}></i>
                        </button>
                    );
                })}
                <p className="stars-text"><b>Stars</b></p>
            </div>
            <button
                className={emptyField ? 'submit-review-button-disabled' : 'form-button form-text submit-review-button'}
                disabled={Boolean(emptyField)}
                type='submit' >Submit Your Review</button>
            </form>
        </div>
    );
}
// frontend/src/components/reviews/deleteReview/index.js
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../../context/Modal";
import { deleteReviews } from "../../../store/reviews";
import { getSingleSpot } from "../../../store/spots";
import "./DeleteReview.css";

export default function DeleteReviewForm(review) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    review = review.review

    const [errors, setErrors] = useState([]);

    const submitDelete = async (e) => {
        e.preventDefault()

        const deleteReview = await dispatch(deleteReviews(review.id))
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) setErrors(data.errors);
            })
        
        dispatch(getSingleSpot(review.spotId))

        closeModal();
    }

    const keepReview = () => {
        closeModal();
    }

    return (
        <div className="delete-form-div">
            <h1 className="title">Are you sure you want to delete this review?</h1>
            <ul className="errors">
                {errors.map((error, idx) => (
                    <li key={idx}>{error}</li>
                ))}
            </ul>
            <form className="form">
                <button type="submit" className="delete-submit-button" onClick={submitDelete}>Yes, Delete This Review!</button>
                <button type="submit" className="keep-submit-button" onClick={keepReview}>No, Keep My Review!</button>
            </form>
        </div>
    )
}
// frontend/src/components/spots/deleteSpots/index.js
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { deleteSpots } from "../../../store/spots";
import { useModal } from "../../../context/Modal";
import "./DeleteSpots.css";

export default function DeleteSpotForm(spot) {
    const dispatch = useDispatch();
    const history = useHistory();
    const { closeModal } = useModal();

    spot = spot.spot

    const [errors, setErrors] = useState([]);

    const submitDelete = async (e) => {
        e.preventDefault()

        const deleteSpot = await dispatch(deleteSpots(spot.id))
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) setErrors(data.errors);
            })
        closeModal();
        history.push('/')
    }

    const keepSpot = () => {
        closeModal();
    }

    return (
        <div className="delete-form">
            <h1 className="form-header">Are you sure you want to delete this spot?</h1>
            <ul className="error-messages">
                {errors.map((error, idx) => (
                    <li key={idx}>{error}</li>
                ))}
            </ul>
            <form className="form">
                <button type="submit" className="delete-button" id="deleteSpot-button" onClick={submitDelete}>Yes, Delete Spot!</button>
                <button type="submit" className="keep-submit-button" onClick={keepSpot}>No, Keep Spot!</button>
            </form>
        </div>
    )
}
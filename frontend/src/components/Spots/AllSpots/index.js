// frontend/src/components/spots/AllSpots/index.js
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { getAllSpots } from "../../../store/spots";

import "./AllSpots.css"

const preview = (image) => {

    if (image === "No preview image available") {
        image = "https://news.airbnb.com/wp-content/uploads/sites/4/2019/06/PJM020719Q202_Luxe_WanakaNZ_LivingRoom_0264-LightOn_R1.jpg?fit=2500%2C1666";
        return image;
    } else {
        return image;
    }
}

export default function AllSpots() {

    const dispatch = useDispatch();
    const history = useHistory();
    const allSpots = useSelector(state => state.spots.spots);

    console.log(allSpots)
    useEffect(() => {
        dispatch(getAllSpots())
    }, [dispatch])


    const spots = [];

    if (!allSpots) return null
    Object.values(allSpots).forEach(spot => spots.push(spot))
    if (!spots.length) return null

    const onClick = (spotId) => {

        history.push(`/spots/${spotId}`)
    }

    const rating = (rating) => {

        if (typeof rating === "number") {
            return rating;
        } else {
            return "New";
        }
    }

    return (
        <div className="allSpots-container">
            {spots && (
                spots.map((spot) => (

                    <div key={spot.id} className="spot"
                        onClick={() => onClick(spot.id)} >
                        <div className="spotImg">
                            <img
                                className="spot-preImg"
                                src={ preview(spot.previewImage) }
                                onClick={() => onClick(spot.id)}
                            />
                        </div>

                        <div className="spot-bottom-container">
                            <div className="spot-header-container">
                                <p>{spot.city}, {spot.state}</p>
                                {typeof spot.avgRating === "number" ? (
                                    <p className="spot-rating">
                                    <i className="fa-solid fa-star" id="star"></i>{ rating(spot.avgRating).toFixed(1) }</p>
                                ) : (
                                    <p className="spot-rating">
                                    <i className="fa-solid fa-star" id="star"></i>New</p>
                                )}
                            </div>



                            <div className="spot-footer-container">
                                <p className="spot-price">${spot.price} per night (USD)</p>
                            </div>

                        </div>
                    </div>
                ))

            )}
        </div >
    )
}

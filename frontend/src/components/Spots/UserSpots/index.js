//frontend/src/components/spots/userspots/index.js
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from 'react-router-dom';
import { Link } from 'react-router-dom';

import { useHistory } from "react-router-dom";
import { getUsersSpots } from "../../../store/spots";


import OpenModalMenuItem from "../../Navigation/OpenModalMenuItem";
import DeleteSpotsForm from "../DeleteSpots";


import "./UserSpots.css"



const preview = (image) => {
    if (image === "No preview image available") {
        image = "https://news.airbnb.com/wp-content/uploads/sites/4/2019/06/PJM020719Q202_Luxe_WanakaNZ_LivingRoom_0264-LightOn_R1.jpg?fit=2500%2C1666";
        return image;
    } else {
        return image;
    }
}

export default function UserSpots() {

    const dispatch = useDispatch();
    const history = useHistory();

    const allSpots = useSelector(state => state.spots.spots);
    const user = useSelector(state => state.session.user);

    useEffect(() => {
        dispatch(getUsersSpots())
    }, [dispatch])


    const spots = [];


    if (!allSpots) {
        return (
            <>
            <h2 className="noSpots-title">
                You have no spots :\
            </h2>
            <div className='Manage-create-spot'>

                <Link exact="true" to="/spots/new" className="manage-spot-text">
                    Create a New Spot
                </Link>
        </div>
        </>
        )
    }

    Object.values(allSpots).forEach(spot => spots.push(spot))

    if (!spots.length) return null


    const rating = (rating) => {

        if (typeof rating === "number") {
            return rating;
        } else {
            return "New";
        }
    }

    return (
        <>
        <div className="header-Manage-Spots">Manage Your Spots</div>
        <div className='Manage-create-spot'>
                <Link exact="true" to="/spots/new" className="manage-spot-text">
                    Create a New Spot
                </Link>
        </div>
        <div className="allSpots-container">
            {spots && (
                spots.map((spot) => (
                    <div key={spot.id} className="spot">
                        <Link exact="true" to={`/spots/${spot.id}`} >
                        <div className="spotImg"  >
                            <img
                                className="spot-preImg"
                                src={preview(spot.previewImage)}
                            />
                        </div>
                        </Link>
                        <div className="spot-bottom-section">
                            <div className="spot-header">
                                <p className="spotLocal">{spot.city}, {spot.state}</p>
                                {typeof spot.avgRating === "number" ? (
                                    <p className="spot-rating">
                                    <i className="fa-solid fa-star" id="star"></i>{ rating(spot.avgRating).toFixed(1) }</p>
                                ) : (
                                    <p className="spot-rating">
                                    <i className="fa-solid fa-star" id="star"></i>New</p>
                                )}
                            </div>
                            <div className="spot-footer">
                                <div className="footer-left-Secion">
                                <p className="price">${spot.price} per night (USD)</p>
                                <div className="edit-option">
                                    <Link exact="true" to={`/spots/${spot.id}/edit`} spot={spot} className="update" >
                                        Update
                                    </Link>
                                </div>
                                <div className="delete-option">
                                    <Link exact="true" to={`/spots/${spot.id}`} className="update">
                                        <OpenModalMenuItem
                                        itemText="Delete"
                                        modalComponent={<DeleteSpotsForm spot={spot} />}
                                        />
                                    </Link>
                                </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
        </>
    )
}

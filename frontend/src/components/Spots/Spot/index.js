// frontend/src/components/spots/spots/index.js
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getSingleSpot } from "../../../store/spots";
import { getSpotReviews } from "../../../store/reviews";

import CreateReviewModal from "../../Reviews/CreateReviewModal";
import DeleteReviewForm from "../../Reviews/DeleteReview";

import OpenModalMenuItem from "../../Navigation/OpenModalMenuItem";



import "./Spot.css"

function reserveClick() {
    alert('Feature Coming Soon');
};

export default function Spot() {
    const { spotId } = useParams()
    const dispatch = useDispatch();

    const spot = useSelector(state => state.spots.singleSpot)
    const user = useSelector(state => state.session.user)
    const reviews = useSelector(state => state.reviews.spotReviews)

    let owner;
    if (user && spot) {
        spot.ownerId === +user.id ? owner = true : owner = false
    }

    useEffect(() => {
        dispatch(getSingleSpot(spotId))
        dispatch(getSpotReviews(spotId))
    }, [dispatch, user, spot.numReviews, owner, spotId])


    if (spot === {}) return null
    if (Object.values(spot).length === 0) return null

    if (spot === undefined) return null;
    if (user === undefined) return null;
    if (reviews === undefined) return null;


    const images = [
        "https://a0.muscache.com/im/pictures/01773f80-f5f8-487c-9a12-b28d91eb1336.jpg?im_w=720",
        "https://a0.muscache.com/im/pictures/fc768d95-8382-46e9-a1ea-d5440ca63618.jpg?im_w=720",
        "https://a0.muscache.com/im/pictures/b69c4864-2ebc-4e5e-9866-1ec84ceef831.jpg?im_w=720",
        "https://a0.muscache.com/im/pictures/a31edca0-34ca-4278-b8ee-e8e2c457cb80.jpg?im_w=720",
        "https://a0.muscache.com/im/pictures/a9a5e884-0ce4-442d-9348-a5bd130e8811.jpg?im_w=720",
    ];


    if (spot) {
        if (spot.SpotImages !== "No images listed") {
            for (let i = 0; i < spot.SpotImages.length; i++) {
                images[i] = spot.SpotImages[i].url;
            }
        }
    }

    const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
    ];

    const convertDate = (date) => {
        const month = monthNames[new Date(date).getMonth()];
        const year = new Date(date).getFullYear();

        return (
        <p className="reviews-date">{month} {year}</p>
        )
    }

    let noUserReview = true;

    if (reviews) {
        const reviewArr = Object.values(reviews)

        if (user) {
            for (let review of reviewArr) {
                if (review.userId === user.id) noUserReview = false
            }
        }

    }

    const rating = (rating) => {

        if (typeof rating === "number") {
            return rating;
        } else {
            return "New";
        }
    }


    return spot && (
        <div className="spot-div">
            <h1 className="spot-name">{spot.name}</h1>
            <div className="header">
                <div className="header-left">
                    <p className="header-left" id="location">{spot.city}, {spot.state}, {spot.country}</p>
                </div>
            </div>
            <div className="img-section">
                <img className="main-picture" src={images[0]} />
                <div className="side-pictures">
                    <img className="side-picture" id="pic-1" src={images[1]} />
                    <img className="side-picture" id="pic-2" src={images[2]} />
                    <img className="side-picture" id="pic-3" src={images[3]} />
                    <img className="side-picture" id="pic-4" src={images[4]} />
                </div>
            </div>
          <div className="spot-detail-section">
            <div className="spot-detail">
                <h2 className="owner-detail"> Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</h2>
                <p className="spot-description">{spot.description}</p>
            </div>
            <div className="reserve-card">
                <div className="reserve-top">
                <div className="reserve-top-left">
                    <p className="Spot-price">${spot.price} per night (USD)</p>
                </div>
                <div className="reserve-top-right">
                        {typeof spot.avgStarRating === "number" ? (
                            <h2 className="header-left"><i className="fa-solid fa-star" id="star-detail"></i>   {rating(spot.avgStarRating).toFixed(1)}</h2>
                        ) : (
                            <h2 className="header-left"><i className="fa-solid fa-star" id="star-detail"></i>   New</h2>
                        )}
                        {spot.numReviews > 0 && (
                            spot.numReviews === 1 ? (
                            <h2 className="spot-reviews-number">• {spot.numReviews} review</h2>
                        ) : (
                            <h2 className="spot-reviews-number">• {spot.numReviews} reviews</h2>
                        ))}
                </div>
            </div>
                <div className="reserve-bottom">
                    <button type="submit" className='login-button' id='log-button'  onClick={reserveClick} >Reserve</button>
                </div>
            </div>
          </div>
          <div className="spot-reviews-header">
                <div className="spot-reviews-header-left">
                    {typeof spot.avgStarRating === "number" ? (
                        <h2 className="header-left"><i className="fa-solid fa-star" id="star-detail"></i>   {rating(spot.avgStarRating).toFixed(1)}</h2>
                    ) : (
                        <h2 className="header-left"><i className="fa-solid fa-star" id="star-detail"></i>   New</h2>
                    )}
                    {spot.numReviews > 0 && (
                    spot.numReviews === 1 ? (
                        <h2 className="spot-reviews-number">• {spot.numReviews} review</h2>
                    ) : (
                        <h2 className="spot-reviews-number">• {spot.numReviews} reviews</h2>
                    ))}
                </div>
                {
                    user && user.id !== spot.ownerId && noUserReview && (
                    <div className="spot-reviews-header-right">
                        <button className="post-review">
                            <OpenModalMenuItem
                                itemText="Post Your Review"
                                modalComponent={<CreateReviewModal spot={spot} />}
                            />
                        </button>
                    </div>
                    )
                }
        </div>
        <div className="spotDetail-reviews">
            {reviews && (
            <div>
                {spot.numReviews === 0 ? (
                    <div>
                        <p>Be the first to post a review!</p>
                    </div>
                ) : (
                    <div>
                        {Object.values(reviews).map((review) => (
                            review.User && (
                                <div key={review.id}>
                                    <div>
                                        <div>
                                            <p className="review-user-name">{review.User.firstName}</p>
                                            <p className="review-date">{convertDate(review.createdAt)}</p>
                                        </div>
                                        <p className="review-spots-text">{review.review}</p>
                                        {user && user.id === review.userId && (

                                            <div>
                                                <button className="delete-review">
                                                <OpenModalMenuItem
                                                    itemText="Delete"
                                                    modalComponent={<DeleteReviewForm review={review} />}
                                                />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        ))}
                    </div>
                )}
            </div>
        )}
    </div>
        
</div>

    )




}


// frontend/src/components/spots/create-spot/index.js
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { addSpots, addPreviewImage } from "../../../store/spots";
import "./CreateSpot.css";

export default function CreateSpotForm() {
    const dispatch = useDispatch();
    const history = useHistory();

    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [preImgUrl, setPreImgUrl] = useState('');
    const [secondImgUrl, setSecondImgUrl] = useState('');
    const [thridImgUrl, setThridImgUrl] = useState("");
    const [fourthImgUrl, setFourthImgUrl] = useState("");
    const [fifthImgUrl, setFifthImgUrl] = useState("");
    const [errors, setErrors] = useState([]);
    const [hasSubmitted, setHasSubmitted] = useState(false);

    useEffect(() => {
        const errors = [];

        if (address === '') {
            errors.address = 'Address is required';
        }

        if (city === '') {
            errors.city = 'City is required';
        }

        if (state === '') {
            errors.state = 'State is required';
        }

        if (country === "") {
            errors.country = "Country is required";
        }

        if (name === "") {
            errors.name = "Name is required";
        }

        if (description.length < 30) {
            errors.description = "Description needs a minimum of 30 characters";
        }

        if (description.length > 500) {
            errors.description = "Description cannot exceed 500 characters";
        }

        if (price === "") {
            errors.price = "Price is required";
        }
        if (preImgUrl === "") {
            errors.previewUrl = "Preview image is required";
        }

        if (!(preImgUrl.endsWith(".png") || preImgUrl.endsWith(".jpg") || preImgUrl.endsWith(".jpeg"))) {
            errors.previewUrlEnd = "Image URL must end in .png, .jpg, or .jpeg";
        }

        if (secondImgUrl) {
            if (!(secondImgUrl.endsWith(".png") || secondImgUrl.endsWith(".jpg") || secondImgUrl.endsWith(".jpeg"))) {
              errors.secondImgUrl = "Image URL must end in .png, .jpg, or .jpeg";
            }
        }

        if (thridImgUrl) {
            if (!(thridImgUrl.endsWith(".png") || thridImgUrl.endsWith(".jpg") || thridImgUrl.endsWith(".jpeg"))) {
              errors.thridImgUrl = "Image URL must end in .png, .jpg, or .jpeg";
            }
        }

        if (fourthImgUrl) {
            if (!(fourthImgUrl.endsWith(".png") || fourthImgUrl.endsWith(".jpg") || fourthImgUrl.endsWith(".jpeg"))) {
              errors.fourthImgUrl = "Image URL must end in .png, .jpg, or .jpeg";
            }
        }

        if (fifthImgUrl) {
            if (!(fifthImgUrl.endsWith(".png") || fifthImgUrl.endsWith(".jpg") || fifthImgUrl.endsWith(".jpeg"))) {
              errors.fifthImgUrl = "Image URL must end in .png, .jpg, or .jpeg";
            }
        }

        setErrors(errors);
    }, [address, city, state, country, name, description, price, preImgUrl, secondImgUrl, thridImgUrl, fourthImgUrl, fifthImgUrl]);

    const onSubmit = async (e) => {
        e.preventDefault();
        setHasSubmitted(true);

        const lat = 13;
        const lng = 4;

        const newSpot = {
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price
        };

        if (Object.keys(errors).length > 0) return;

        const url = preImgUrl;

        const createdSpot = await dispatch(addSpots(newSpot))
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) setErrors(data.errors);
            })

        const previewImage = await dispatch(addPreviewImage(createdSpot.id, url, true))
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) setErrors(data.errors);
            })

        history.push(`/spots/${createdSpot.id}`);
    }

    return (
        <div className="spotForm-div">
            <form className="spot-form" onSubmit={onSubmit}>
                <h1 className="form-text form-header">Create a Spot</h1>
                <div className="first-section">
                    <h2 className="input-header">Where's your spot located?</h2>
                    <p className="input-description">Guests will have access to your exact address only once they have booked a reservation.</p>
                    <label className="form-text" htmlFor="country"></label>
                    {<span className={hasSubmitted ? 'error' : 'hidden'}>{errors.country}</span>}
                        <input
                            type='text'
                            id='country'
                            placeholder="Country"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                        />
                    <label className="form-text"></label>
                    {<span className={hasSubmitted ? 'error' : 'hidden'}>{errors.address}</span>}
                        <input
                            type='text'
                            placeholder="Street Address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    <div className="city-state-section">
                    <div className="city">
                    <label className="form-text"></label>
                    {<span className={hasSubmitted ? 'error' : 'hidden'}>{errors.city}</span>}
                         <input
                            type='text'
                            placeholder="City"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                        />
                    </div>
                    <p className="comma">,</p>
                    <div className="state">
                    <label className="form-text"></label>
                    {<span className={hasSubmitted ? 'error' : 'hidden'}>{errors.state}</span>}
                         <input 
                            type='text'
                            placeholder="State"
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                        />
                    </div>
                 </div>
             </div>
             <div className="second-section">
                <h2 className="input-header">Describe your spot to guests.</h2>
                <p className="input-description">Include best amenities and features your spot has to offer. E.g. Fast Wifi or Great Parking or Minutes away from Downtown and major attractions and etc...</p>
                <textarea
                    className="description"
                    placeholder="Please write up to at least 30 characters."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                {<span className={hasSubmitted ? 'error' : 'hidden'}>{errors.description}</span>}
             </div>
             <div className="third-section">
                <h2 className="input-header">Provide a name for your spot.</h2>
                <p className="input-description">Catch guests' attention with a name that highlights your spot.</p>
                <input 
                    type='text'
                    placeholder="Name your spot"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                {<span className={hasSubmitted ? 'error' : 'hidden'}>{errors.name}</span>}
             </div>
             <div className="fourth-section">
                <h2 className="input-header">Set a base price for your spot.</h2>
                <p className="input-description">A reasonable and competitive price can help your listing stand out and increase bookings.</p>
                <div className="price-input">
                    <p className="dollar-sign">$</p>
                    <input
                        type='text'
                        placeholder="Price per night (USD)."
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </div>
                {<span className={hasSubmitted ? 'error' : 'hidden'}>{errors.price}</span>}
             </div>
             <div className="fifth-section">
                <h2 className="input-header">Make your spot stand out by including detailed pictures.</h2>
                <p className="input-description">You can upload up to 10 pictures for each listing. Be sure to submit a link to each picture.</p>
                <input
                    type='text'
                    placeholder="Preview Image URL"
                    value={preImgUrl}
                    onChange={(e) => setPreImgUrl(e.target.value)}
                />
                <div className="preImgErr">
                    {<span className={hasSubmitted ? 'error' : 'hidden'}>{errors.previewUrl}</span>}
                    {<span className={hasSubmitted ? 'error' : 'hidden'}>{errors.previewUrlEnd}</span>}
                </div>
                <input
                    type='text'
                    placeholder="Image URL"
                    value={secondImgUrl}
                    onChange={(e) => setSecondImgUrl(e.target.value)}
                />
                {<span className={(hasSubmitted && secondImgUrl) ? 'error' : 'hidden'}>{errors.secondImgUrl}</span>}
                <input
                    type='text'
                    placeholder="Image URL"
                    value={thridImgUrl}
                    onChange={(e) => setThridImgUrl(e.target.value)}
                />
                {<span className={(hasSubmitted && thridImgUrl) ? 'error' : 'hidden'}>{errors.thridImgUrl}</span>}
                <input
                    type='text'
                    placeholder="Image Url"
                    value={fourthImgUrl}
                    onChange={(e) => setFourthImgUrl(e.target.value)}
                />
                {<span className={(hasSubmitted && fourthImgUrl) ? 'error' : 'hidden'}>{errors.fourthImgUrl}</span>}
                <input
                    type='text'
                    placeholder="Image URL"
                    value={fifthImgUrl}
                    onChange={(e) => setFifthImgUrl(e.target.value)}
                />
                {<span className={(hasSubmitted && fifthImgUrl) ? 'error' : 'hidden'}>{errors.fifthImgUrl}</span>}
             </div>
             <div className="spot-button-div">
                <button className="createSpot-button form-text" type="submit">Create Spot</button>
             </div>
        </form>
     </div>
    );
}
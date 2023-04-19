import React, { useState } from 'react';

function LocationForm(props) {

    const [city, setCity] = useState('');
    const [stateInput, setStateInput] = useState('');
    const [country, setCountry] = useState('');

    const handleInputChange = (event) => {
        const option = event.target.id;
        const value = event.target.value;

        switch(option) {
            case 'city': setCity(value); break;
            case 'state': setStateInput(value); break;
            case 'country': setCountry(value); break;
        }

    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(city, stateInput, country)
        props.getLocation(city, stateInput, country);
    }

    return (
        <div className="location-form">
            <form className='location-form'>
            <div className="city">
                <label>City</label>
                <input id='city' type='text' required onChange={handleInputChange}></input>
            </div>
            <div className="state">
                <label >State</label>
                <input id='state' type='text' onChange={handleInputChange}></input>
            </div>
            <div className="country">
                <label >Country</label>
                <input id='country' type='text' onChange={handleInputChange}></input>
            </div>
            <div className="submit">
                <button className='submit-button' type='submit' onClick={handleSubmit} >Submit</button>
            </div>
            </form>
        </div>
    )
}

export default LocationForm;
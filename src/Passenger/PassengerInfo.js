import React, {Component} from 'react';
import axios from "axios";
import {API_URL} from "../constants";
import queryString from 'querystring';

class PassengerInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            passenger: null
        };
    }

    componentDidMount() {
        const passengerId = queryString.parse(this.props.location.search, {ignoreQueryPrefix: true})['?passengerId'];

        const {userProfile, getProfile} = this.props.auth;

        if (!userProfile) {
            getProfile((err, profile) => {
                axios.get(`${API_URL}/passenger/${passengerId}`)
                    .then(response => this.setState({passenger: response.data}))
                    .catch(error => this.setState({message: error.message}));
            });
        } else {
            axios.get(`${API_URL}/passenger/${passengerId}`)
                .then(response => this.setState({passenger: response.data}))
                .catch(error => this.setState({message: error.message}));
        }
    }

    render() {
        return (
            <div className="container">
                <h1>Passenger info</h1>
                {this.state.passenger != null && (
                    <div>
                        <h4>First name</h4>
                        <p>{this.state.passenger.firstName}</p>
                        <h4>Last name</h4>
                        <p>{this.state.passenger.lastName}</p>
                        <h4>Passport number</h4>
                        <p>{this.state.passenger.passportNo}</p>
                        <h4>Street</h4>
                        <p>{this.state.passenger.street !== "" ? (this.state.passenger.street) : "---"}</p>
                        <h4>City</h4>
                        <p>{this.state.passenger.city !== "" ? (this.state.passenger.city) : "---"}</p>
                        <h4>Country code</h4>
                        <p>{this.state.passenger.countryCode !== "" ? (this.state.passenger.countryCode) : "---"}</p>
                        <h4>Phone number</h4>
                        <p>{this.state.passenger.phone !== "" ? (this.state.passenger.phone) : "---"}</p>
                    </div>
                )}
            </div>);
    }
}

export default PassengerInfo;

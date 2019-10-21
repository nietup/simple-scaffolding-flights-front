import React, {Component} from 'react';
import axios from "axios";
import {API_URL} from "../constants";

class BookedFlights extends Component {
    constructor(props) {
        super(props);
        this.state = {response: []};
    }

    componentDidMount() {
        const {userProfile, getProfile} = this.props.auth;

        if (!userProfile) {
            getProfile((err, profile) => {
                axios.get(`${API_URL}/passengers/${profile.sub}/flights`)
                    .then(response => this.setState({response: response.data}))
                    .catch(error => this.setState({message: error.message}));
            });
        } else {
            axios.get(`${API_URL}/passengers/${userProfile.sub}/flights`)
                .then(response => this.setState({response: response.data}))
                .catch(error => this.setState({message: error.message}));
        }
    }

    render() {
        return (
            <div className="container">
                {this.state.response.length === 0 && <div>Loading...</div>}
                {this.state.response.length > 0 &&
                (<div>
                    <h1>Your booked flights:</h1>
                    <table className="table-bordered" style={{width: "100%", margin: ".5rem"}}>
                        <thead>
                        <tr>
                            <th>Flight number</th>
                            <th>Source IATA</th>
                            <th>Destination IATA</th>
                            <th>Start time</th>
                            <th>Landing time</th>
                        </tr>
                        </thead>
                        {this.state.response.map(flight =>
                            <tbody>
                            <tr>
                                <td>{flight.flightNo}</td>
                                <td>{flight.sourceIata}</td>
                                <td>{flight.destinationIata}</td>
                                <td>{flight.startTime}</td>
                                <td>{flight.landingTime}</td>
                            </tr>
                            </tbody>
                        )}
                    </table>
                </div>)}
            </div>
        );
    }
}

export default BookedFlights;
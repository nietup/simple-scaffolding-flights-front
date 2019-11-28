import React, {Component} from 'react';
import axios from "axios";
import {API_URL} from "../constants";
import {Link} from "react-router-dom";

class BookedFlights extends Component {
    constructor(props) {
        super(props);
        this.state = {response: null};
    }

    componentDidMount() {
        const {userProfile, getProfile} = this.props.auth;

        if (!userProfile) {
            getProfile((err, profile) => {
                axios.get(`${API_URL}/passenger/${profile.sub}/flights`)
                    .then(response => this.setState({response: response.data}))
                    .catch(error => this.setState({message: error.message}));
            });
        } else {
            axios.get(`${API_URL}/passenger/${userProfile.sub}/flights`)
                .then(response => this.setState({response: response.data}))
                .catch(error => this.setState({message: error.message}));
        }
    }

    render() {
        return (
            <div className="container">
                {this.state.response === null && <div>Loading...</div>}
                {this.state.response !== null && this.state.response.length === 0 && <div>You don't have any flights yet</div>}
                {this.state.response !== null && this.state.response.length > 0 &&
                (<div>
                    <h1>Your booked flights:</h1>
                    <table className="table-bordered" style={{width: "100%", margin: ".5rem"}}>
                        <thead>
                        <tr>
                            <th>First name</th>
                            <th>Last name</th>
                            <th>Flight number</th>
                            <th>Source IATA</th>
                            <th>Destination IATA</th>
                            <th>Start time</th>
                            <th>Landing time</th>
                        </tr>
                        </thead>
                        {this.state.response.map(row =>
                            <tbody>
                            <tr>
                                <td><Link to={`/passenger-info?passengerId=${row.passengerId}`}>{row.firstName}</Link></td>
                                <td><Link to={`/passenger-info?passengerId=${row.passengerId}`}>{row.lastName}</Link></td>
                                <td>{row.flightNo}</td>
                                <td>{row.sourceIata}</td>
                                <td>{row.destinationIata}</td>
                                <td>{row.startTime}</td>
                                <td>{row.landingTime}</td>
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
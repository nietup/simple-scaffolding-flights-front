import React, {Component} from 'react';
import {Field, Form, Formik} from 'formik';
import {Button} from "react-bootstrap";
import axios from "axios";
import {API_URL} from "../constants";
import {Link} from "react-router-dom";

class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {response: []};
    }

    handleSubmit = (values, actions) => {
        // axios.post(`${API_URL}/flight-search`, {
        //     "sourceCity": values.startCity,
        //     "destinationCity": values.destinationCity,
        //     "startTime": values.startDate + "T" + values.startTime + "+00:00",
        //     "timeRange": values.timeRange
        // })
        axios.post(`${API_URL}/flight-search`, {
            "sourceCity": "Warsawabab",
            "destinationCity": "Dubai",
            "startTime": "2019-09-19T15:00:00+02:00",
            "timeRange": 100
        })
            .then(response => this.setState({response: response.data}))
            .catch(error => this.setState({message: error.message}));

        actions.setSubmitting(false);
    };

    render() {
        return (
            <div>
                <h1>Find your flight</h1>
                <Formik
                    initialValues={{startCity: "", destinationCity: "", startDate: 0, startTime: 0, timeRange: 0}}
                    onSubmit={this.handleSubmit}
                    render={({errors, status, touched, isSubmitting}) => (
                        <Form>
                            <label style={{display: 'block'}}>
                                Start city
                            </label>
                            <Field
                                type="text"
                                name="startCity"
                                placeholder="Start city"
                                style={{display: 'block', padding: ".5rem", margin: ".5rem"}}
                            />
                            <label style={{display: 'block'}}>
                                Destination city
                            </label>
                            <Field
                                type="text"
                                name="destinationCity"
                                placeholder="Destination city"
                                style={{display: 'block', padding: ".5rem", margin: ".5rem"}}
                            />
                            <label style={{display: 'block'}}>
                                Departure time
                            </label>
                            <Field
                                type="date"
                                name="startDate"
                                style={{padding: ".5rem", margin: ".5rem"}}
                            />
                            <Field
                                type="time"
                                name="startTime"
                                style={{padding: ".5rem", margin: ".5rem"}}
                            />
                            <label style={{display: 'block'}}>
                                Time range
                            </label>
                            <Field
                                type="number"
                                name="timeRange"
                                style={{display: 'block', padding: ".5rem", margin: ".5rem"}}
                            />
                            <Button
                                bsStyle="primary"
                                className="btn-margin"
                                type="submit"
                                disabled={isSubmitting}
                            >
                                Submit
                            </Button>
                        </Form>
                    )}
                />
                {this.state.response.length > 0 &&
                (<div>
                    <hr/>
                    <table className="table-bordered" style={{width: "100%", margin: ".5rem"}}>
                        <thead>
                        <tr>
                            <th>Flight number</th>
                            <th>Source IATA</th>
                            <th>Destination IATA</th>
                            <th>Start time</th>
                            <th>Landing time</th>
                            <th></th>
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
                                <td>
                                    <Link to={`/passenger?flightNo=${flight.flightNo}`} className="btn btn-primary btn-margin">Reserve</Link>
                                </td>
                            </tr>
                            </tbody>
                        )}
                    </table>
                </div>)}
            </div>
        );
    }
}

export default Search;
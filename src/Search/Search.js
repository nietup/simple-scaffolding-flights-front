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
        axios.post(`${API_URL}/flight/search`, {
            "sourceCity": values.startCity,
            "destinationCity": values.destinationCity,
            "startTime": values.startDate + "T" + values.startTime,
            "timeRange": values.timeRange
        })
            .then(response => this.setState({response: response.data}))
            .catch(error => this.setState({message: error.message}));

        actions.setSubmitting(false);
    };

    validateNotNull = (value) => {
        let error;
        if (value === '' || value === 0) {
            error = 'Field cannot be null!';
        }
        return error;
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
                                validate={this.validateNotNull}
                            />
                            <div>
                                Warsaw
                            </div>
                            {errors.startCity && touched.startCity &&
                            <div
                                style={{color: 'red'}}>
                                {errors.startCity}
                            </div>}
                            <label style={{display: 'block'}}>
                                Destination city
                            </label>
                            <Field
                                type="text"
                                name="destinationCity"
                                placeholder="Destination city"
                                style={{display: 'block', padding: ".5rem", margin: ".5rem"}}
                                validate={this.validateNotNull}
                            />
                            <div>
                                Helsinki
                            </div>
                            {errors.destinationCity && touched.destinationCity &&
                            <div
                                style={{color: 'red'}}>
                                {errors.destinationCity}
                            </div>}
                            <label style={{display: 'block'}}>
                                Departure time
                            </label>
                            <Field
                                type="date"
                                name="startDate"
                                style={{padding: ".5rem", margin: ".5rem"}}
                                validate={this.validateNotNull}
                            />
                            <Field
                                type="time"
                                name="startTime"
                                style={{padding: ".5rem", margin: ".5rem"}}
                                validate={this.validateNotNull}
                            />
                            <div>
                                12.09.2019
                            </div>
                            {((errors.startDate && touched.startDate) || (errors.startTime && touched.startTime)) &&
                            <div style={{color: 'red'}}>
                                Departure time cannot be null!
                            </div>}
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
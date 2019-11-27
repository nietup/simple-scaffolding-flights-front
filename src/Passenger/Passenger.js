import React, {Component} from 'react';
import {Field, Form, Formik} from 'formik';
import {Button} from "react-bootstrap";
import axios from "axios";
import {API_URL} from "../constants";
import queryString from 'querystring';
import {ToastsContainer, ToastsStore, ToastsContainerPosition} from 'react-toasts';
import {Redirect} from "react-router";

class Passenger extends Component {
    constructor(props) {
        super(props);
        this.state = {
            flightNo: "",
            redirectToReferrer: false,
            flight: null
        };
    }

    componentDidMount() {
        var flightNo = queryString.parse(this.props.location.search, {ignoreQueryPrefix: true})['?flightNo'];
        this.setState({flightNo: flightNo});

        const {userProfile, getProfile} = this.props.auth;

        if (!userProfile) {
            getProfile((err, profile) => {
                axios.get(`${API_URL}/flight/${flightNo}`)
                    .then(response => this.setState({flight: response.data}))
                    .catch(error => this.setState({message: error.message}));
            });
        } else {
            axios.get(`${API_URL}/flight/${flightNo}`)
                .then(response => this.setState({flight: response.data}))
                .catch(error => this.setState({message: error.message}));
        }
    }

    handleSubmit = (values, actions) => {
        const {getAccessToken, userProfile, getProfile} = this.props.auth;

        if (!userProfile) {
            getProfile((err, profile) => {
                this.sendRequest(getAccessToken, values, profile, actions);
            });
        } else {
            this.sendRequest(getAccessToken, values, userProfile, actions);
        }
    };

    sendRequest = (getAccessToken, values, profile, actions) => {
        const payload = {
            "flightNo": this.state.flightNo,
            "firstName": values.firstName,
            "lastName": values.lastName,
            "passportNo": values.passport,
            "street": values.street,
            "city": values.city,
            "countryCode": values.country,
            "phone": values.phone,
            "sub": profile.sub
        };

        const headers = {headers: {Authorization: `Bearer ${getAccessToken()}`}};

        axios.post(`${API_URL}/passenger`, payload, headers)
            .then(response => {
                actions.setSubmitting(false);
                this.setState({redirectToReferrer: true});
            })
            .catch(error => {console.log(((error.response || {}).data || {}).message);
                ToastsStore.error(this.mapErrorMessage(((error.response || {}).data || {}).message));
                actions.setSubmitting(false);
            });
    };

    mapErrorMessage = (message) => {
        if (message.includes('could not execute statement; SQL [n/a]; constraint'))
            return "Passport number must be unique";
        else
            return message;
    };

    validateNotNull = (value) => {
        let error;
        if (value === '') {
            error = 'Field cannot be null!';
        }
        return error;
    };

    render() {
        const { redirectToReferrer } = this.state;

        if (redirectToReferrer === true) {
            return <Redirect to="/booked-flights" />
        }

        return (
            <div className={"container"}>
                <ToastsContainer position={ToastsContainerPosition.TOP_RIGHT} store={ToastsStore}/>
                <h1>Book flight {this.state.flightNo}</h1>
                {this.state.flight != null &&
                (<div>
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
                        <tbody>
                        <tr>
                            <td>{this.state.flight.flightNo}</td>
                            <td>{this.state.flight.sourceIata}</td>
                            <td>{this.state.flight.destinationIata}</td>
                            <td>{this.state.flight.startTime}</td>
                            <td>{this.state.flight.landingTime}</td>
                        </tr>
                        </tbody>
                    </table>
                    <hr/>
                </div>)}
                <h2>Passenger data</h2>
                <Formik
                    initialValues={{
                        firstName: "",
                        lastName: "",
                        passport: "",
                        street: "",
                        city: "",
                        country: "",
                        phone: "",
                        flightNo: ""
                    }}
                    onSubmit={this.handleSubmit}
                    render={({errors, status, touched, isSubmitting}) => (
                        <Form>
                            <label style={{display: 'block'}}>
                                First name
                            </label>
                            <Field
                                type="text"
                                name="firstName"
                                placeholder="first name"
                                style={{display: 'block', padding: ".5rem", margin: ".5rem"}}
                                validate={this.validateNotNull}
                            />
                            {errors.firstName && touched.firstName &&
                            <div
                                style={{color: 'red'}}>
                                {errors.firstName}
                            </div>}
                            <label style={{display: 'block'}}>
                                Last name
                            </label>
                            <Field
                                type="text"
                                name="lastName"
                                placeholder="last name"
                                style={{display: 'block', padding: ".5rem", margin: ".5rem"}}
                                validate={this.validateNotNull}
                            />
                            {errors.lastName && touched.lastName &&
                            <div
                                style={{color: 'red'}}>
                                {errors.lastName}
                            </div>}
                            <label style={{display: 'block'}}>
                                Passport number
                            </label>
                            <Field
                                type="text"
                                name="passport"
                                placeholder="passport"
                                style={{display: 'block', padding: ".5rem", margin: ".5rem"}}
                                validate={this.validateNotNull}
                            />
                            {errors.passport && touched.passport &&
                            <div
                                style={{color: 'red'}}>
                                {errors.passport}
                            </div>}
                            <label style={{display: 'block'}}>
                                Street
                            </label>
                            <Field
                                type="text"
                                name="street"
                                placeholder="street"
                                style={{display: 'block', padding: ".5rem", margin: ".5rem"}}
                            />
                            <label style={{display: 'block'}}>
                                City
                            </label>
                            <Field
                                type="text"
                                name="city"
                                placeholder="city"
                                style={{display: 'block', padding: ".5rem", margin: ".5rem"}}
                            />
                            <label style={{display: 'block'}}>
                                Country code
                            </label>
                            <Field
                                type="text"
                                name="country"
                                placeholder="country code"
                                style={{display: 'block', padding: ".5rem", margin: ".5rem"}}
                            />
                            <label style={{display: 'block'}}>
                                Phone number
                            </label>
                            <Field
                                type="text"
                                name="phone"
                                placeholder="phone number"
                                style={{display: 'block', padding: ".5rem", margin: ".5rem"}}
                            />
                            <label style={{display: 'block'}}>
                                Flight number
                            </label>
                            <Field
                                type="text"
                                name="flightNo"
                                value={this.state.flightNo}
                                disabled={true}
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
            </div>
        );
    }
}

export default Passenger;
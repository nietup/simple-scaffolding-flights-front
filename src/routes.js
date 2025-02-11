import React from 'react';
import {Redirect, Route, Router} from 'react-router-dom';
import App from './App';
import Home from './Home/Home';
import Profile from './Profile/Profile';
import Ping from './Ping/Ping';
import Callback from './Callback/Callback';
import Auth from './Auth/Auth';
import history from './history';
import Passenger from './Passenger/Passenger';
import BookedFlights from "./Passenger/BookedFlights";
import PassengerInfo from "./Passenger/PassengerInfo";

const auth = new Auth();

const handleAuthentication = ({location}) => {
    if (/access_token|id_token|error/.test(location.hash)) {
        auth.handleAuthentication();
    }
}

export const makeMainRoutes = () => {
    return (
        <Router history={history}>
            <div>
                <Route path="/" render={(props) => <App auth={auth} {...props} />}/>
                <Route path="/home" render={(props) => <Home auth={auth} {...props} />}/>
                <Route path="/profile" render={(props) => (
                    !auth.isAuthenticated() ? (
                        <Redirect to="/home"/>
                    ) : (
                        <Profile auth={auth} {...props} />
                    )
                )}/>
                <Route path="/ping" render={(props) => (
                    !auth.isAuthenticated() ? (
                        <Redirect to="/home"/>
                    ) : (
                        <Ping auth={auth} {...props} />
                    )
                )}/>
                <Route path="/passenger" render={(props) => (
                    !auth.isAuthenticated() ? (
                        <Redirect to="/home"/>
                    ) : (
                        <Passenger auth={auth} {...props} />
                    )
                )}/>
                <Route path="/booked-flights" render={(props) => (
                    !auth.isAuthenticated() ? (
                        <Redirect to="/home"/>
                    ) : (
                        <BookedFlights auth={auth} {...props} />
                    )
                )}/>
                <Route path="/passenger-info" render={(props) => (
                    !auth.isAuthenticated() ? (
                        <Redirect to="/home"/>
                    ) : (
                        <PassengerInfo auth={auth} {...props} />
                    )
                )}/>
                <Route path="/callback" render={(props) => {
                    handleAuthentication(props);
                    return <Callback {...props} />
                }}/>
            </div>
        </Router>
    );
}

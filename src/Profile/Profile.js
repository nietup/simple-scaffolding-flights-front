import React, {Component} from 'react';
import './Profile.css';

class Profile extends Component {
    componentWillMount() {
        this.setState({profile: {}});
        const {userProfile, getProfile} = this.props.auth;
        if (!userProfile) {
            getProfile((err, profile) => {
                this.setState({profile});
            });
        } else {
            this.setState({profile: userProfile});
        }
    }

    render() {
        const {profile} = this.state;
        return (
            <div className="container">
                <div className="profile-area">
                    <h1>{profile.name}</h1>
                </div>
            </div>
        );
    }
}

export default Profile;

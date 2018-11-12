import React, {Component} from "react";
import {FormGroup, FormControl, ControlLabel} from "react-bootstrap";
import {Auth} from "aws-amplify";
import LoaderButton from "../components/LoaderButton";
import "./Profile.css";


export default class Profile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            username: "",
            email: "",
            firstName: "",
            lastName: "",
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
            changePassword: false
        };

        //loads the user's data
        this.getUser();
    }

    getUser = async event => {
        try {
            var self = this;

            let input = await Auth.currentAuthenticatedUser().then(response => input = response.username);
            var url = 'https://p9i6m89j01.execute-api.eu-west-2.amazonaws.com/prod/users?userID=' + input;

            //gets the current user data from the database and loads it in the form
            await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => res.json())
                .then(response => self.setState({
                    username: response.Item.userID,
                    email: response.Item.email,
                    firstName: response.Item.firstName,
                    lastName: response.Item.lastName,
                }))
                .catch(error => console.error('Error:', error));
        } catch (e) {
            alert(e.message);
        }
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    changePassword = event => {
        this.setState({changePassword: true});
    }

    handleChangePassword = event => {
        //makes request to change the password
        Auth.currentAuthenticatedUser()
            .then(user => {
                return Auth.changePassword(user, this.state.oldPassword, this.state.newPassword);
            })
            .then(data => console.log(data))
            .catch(err => console.log(err));

    }

    validateForm() {
        return (
            this.state.firstName.length > 0 &&
            this.state.lastName.length > 0 &&
            this.state.email.length > 0
        );
    }

    validatePasswordForm() {
        return (
            this.state.oldPassword.length > 0 &&
            this.state.newPassword.length > 0 &&
            this.state.newPassword === this.state.confirmPassword
        );
    }


    handleSaveChanges = async event => {
        event.preventDefault();
        this.setState({isLoading: true});

        //puts the updated user data back in the database
        var url = 'https://p9i6m89j01.execute-api.eu-west-2.amazonaws.com/prod/users';
        var data = {
            userID: this.state.username,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            email: this.state.email
        };

        fetch(url, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
            .then(response => console.log('Success:', JSON.stringify(response)))
            .catch(error => console.error('Error:', error));

        this.setState({isLoading: false});
    }

    renderForm() {
        return (
            <form onSubmit={this.handleSaveChanges}>
                <FormGroup controlId="username" bsSize="large">
                    <ControlLabel>Username</ControlLabel>
                    <FormControl
                        type="username"
                        value={this.state.username}
                        disabled={true}
                        onChange={this.handleChange}
                    />
                </FormGroup>
                <FormGroup controlId="firstName" bsSize="large">
                    <ControlLabel>First Name</ControlLabel>
                    <FormControl
                        autoFocus
                        type="text"
                        value={this.state.firstName}
                        onChange={this.handleChange}
                    />
                </FormGroup><FormGroup controlId="lastName" bsSize="large">
                <ControlLabel>Last Name</ControlLabel>
                <FormControl
                    type="text"
                    value={this.state.lastName}
                    onChange={this.handleChange}
                />
            </FormGroup>
                <FormGroup controlId="email" bsSize="large">
                    <ControlLabel>Email</ControlLabel>
                    <FormControl
                        type="email"
                        value={this.state.email}
                        onChange={this.handleChange}
                    />
                </FormGroup>
                <LoaderButton
                    block
                    bsSize="large"
                    type="submit"
                    isLoading={this.state.isLoading}
                    disabled={!this.validateForm()}
                    text="Save changes"
                    loadingText="Saving changes…"
                />
                <LoaderButton
                    block
                    bsSize="large"
                    type="submit"
                    isLoading={this.state.isLoading}
                    onClick={this.changePassword}
                    text="Change password"
                    loadingText="Changing password…"
                />
            </form>
        );
    }

    renderPasswordForm() {
        return (
            <form onSubmit={this.handleChangePassword}>
                <FormGroup controlId="oldPassword" bsSize="large">
                    <ControlLabel>Old Password</ControlLabel>
                    <FormControl
                        value={this.state.oldPassword}
                        onChange={this.handleChange}
                        type="password"
                    />
                </FormGroup>
                <FormGroup controlId="newPassword" bsSize="large">
                    <ControlLabel>New Password</ControlLabel>
                    <FormControl
                        value={this.state.newPassword}
                        onChange={this.handleChange}
                        type="password"
                    />
                </FormGroup>
                <FormGroup controlId="confirmPassword" bsSize="large">
                    <ControlLabel>Confirm Password</ControlLabel>
                    <FormControl
                        value={this.state.confirmPassword}
                        onChange={this.handleChange}
                        type="password"
                    />
                </FormGroup>
                <LoaderButton
                    block
                    bsSize="large"
                    type="submit"
                    isLoading={this.state.isLoading}
                    disabled={!this.validatePasswordForm()}
                    text="Change password"
                    loadingText="Changing…"
                />
            </form>
        );
    }

    render() {
        return (
            <div className="Profile">
                {this.state.changePassword === false
                    ? this.renderForm()
                    : this.renderPasswordForm()}
            </div>
        );
    }
}
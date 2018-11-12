import React, {Component} from "react";
import {HelpBlock, FormGroup, FormControl, ControlLabel} from "react-bootstrap";
import {Auth} from "aws-amplify";
import LoaderButton from "../components/LoaderButton";
import "./Signup.css";

export default class Signup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            username: "",
            position: "",
            email: "",
            password: "",
            confirmPassword: "",
            confirmationCode: "",
            newUser: null
        };
    }

    validateForm() {
        return (
            this.state.username.length > 0 &&
            this.state.position.length > 0 &&
            this.state.email.length > 0 &&
            this.state.password.length > 0 &&
            this.state.password === this.state.confirmPassword
        );
    }

    sendMail = event => {
        //sends an email to the newly registered user with his account created by the admin
        var url = 'https://p9i6m89j01.execute-api.eu-west-2.amazonaws.com/prod/users/userid';
        var content = "Hello! Your account in our system is ready for you to use." +
            " This is your username:" + this.state.username + " and this is your password:" + this.state.password +
            "Please login and change your password";
        var data = {
            toAddress: [this.state.email],
            source: "ss1g16@soton.ac.uk",
            subject: "Welcome in our system",
            content: content
        };

        fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
            .then(response => console.log('Success:', JSON.stringify(response)))
            .catch(error => console.error('Error:', error));
    }

    validateConfirmationForm() {
        return this.state.confirmationCode.length > 0;
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }


    handleSubmit = async event => {
        event.preventDefault();
        this.setState({isLoading: true});

        try {
            //signUp new user
            const newUser = await Auth.signUp({
                username: this.state.username,
                password: this.state.password,
                attributes: {
                    email: this.state.email
                }

            });
            this.setState({
                newUser
            });

            //adds the new user in tha database
            var url = 'https://p9i6m89j01.execute-api.eu-west-2.amazonaws.com/prod/users';
            var data = {
                userID: this.state.username,
                pos: this.state.position,
                firstName: " ",
                lastName: " ",
                email: this.state.email
            };

            fetch(url, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => res.json())
                .then(response => console.log('Success:', JSON.stringify(response)))
                .catch(error => console.error('Error:', error));


        } catch (e) {
            alert(e.message);
        }

        this.setState({isLoading: false});
    }

    handleConfirmationSubmit = async event => {
        event.preventDefault();
        this.setState({isLoading: true});

        try {
            //admin has to confirm the new user
            await Auth.confirmSignUp(this.state.username, this.state.confirmationCode);
            this.sendMail();
            this.props.history.push("/");
        } catch (e) {
            alert(e.message);
            this.setState({isLoading: false});
        }
    }


    renderConfirmationForm() {
        return (
            <form onSubmit={this.handleConfirmationSubmit}>
                <FormGroup controlId="confirmationCode" bsSize="large">
                    <ControlLabel>Confirmation Code</ControlLabel>
                    <FormControl
                        autoFocus
                        type="tel"
                        value={this.state.confirmationCode}
                        onChange={this.handleChange}
                    />
                    <HelpBlock>Please check your email for the code.</HelpBlock>
                </FormGroup>
                <LoaderButton
                    block
                    bsSize="large"
                    disabled={!this.validateConfirmationForm()}
                    type="submit"
                    isLoading={this.state.isLoading}
                    text="Verify"
                    loadingText="Verifying…"
                />
            </form>
        );
    }

    renderForm() {
        return (
            <form onSubmit={this.handleSubmit}>
                <FormGroup controlId="username" bsSize="large">
                    <ControlLabel>Username</ControlLabel>
                    <FormControl
                        autoFocus
                        type="username"
                        value={this.state.username}
                        onChange={this.handleChange}
                    />
                </FormGroup>
                <FormGroup controlId="position">
                    <ControlLabel>Select position</ControlLabel>
                    <FormControl value={this.state.position === "" ? "Select position" : this.state.position}
                                 componentClass="select" placeholder="Select position"
                                 onChange={this.handleChange}>
                        <option disabled value="Select position">Select position</option>
                        <option value="admin">admin</option>
                        <option value="project manager">project manager</option>
                        <option value="developer">developer</option>
                    </FormControl>
                </FormGroup>
                <FormGroup controlId="email" bsSize="large">
                    <ControlLabel>Email</ControlLabel>
                    <FormControl
                        type="email"
                        value={this.state.email}
                        onChange={this.handleChange}
                    />
                </FormGroup>
                <FormGroup controlId="password" bsSize="large">
                    <ControlLabel>Password</ControlLabel>
                    <FormControl
                        value={this.state.password}
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
                    disabled={!this.validateForm()}
                    type="submit"
                    isLoading={this.state.isLoading}
                    text="Signup"
                    loadingText="Signing up…"
                />
            </form>
        );
    }

    render() {
        return (
            <div className="Signup">
                {this.state.newUser === null
                    ? this.renderForm()
                    : this.renderConfirmationForm()}
            </div>
        );
    }
}
import React, {Component} from "react";
import {FormGroup, FormControl, ControlLabel, HelpBlock} from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import "./Login.css";
import {Auth} from "aws-amplify";

export default class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            username: "",
            password: "",
            confirmationCode: "",
            resetForm: false
        };
    }

    validateForm() {
        return this.state.username.length > 0 && this.state.password.length > 0;
    }

    validateConfirmationForm() {
        return this.state.confirmationCode.length > 0 && this.state.password.length > 0;
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
            //logs in the user
            await Auth.signIn(this.state.username, this.state.password);
            this.props.userHasAuthenticated(true);
        } catch (e) {
            alert(e.message);
        }
        window.location.reload()
    }

    handleResetPassword = async event => {
        event.preventDefault();
        this.setState({isLoading: true});

        //sends validation code to the user's email
        Auth.forgotPassword(this.state.username)
            .then(data => console.log(data))
            .catch(err => console.log(err));

        this.setState({resetForm: true});
        this.setState({isLoading: false});
    }

    handleResetPasswordConfirmation = async event => {
        event.preventDefault();

        //confirms the new password with the validation code
        Auth.forgotPasswordSubmit(this.state.username, this.state.confirmationCode, this.state.password)
            .then(data => console.log(data))
            .catch(err => console.log(err));

        this.setState({isLoading: false});
        window.location.reload()
    }

    renderConfirmationForm() {
        return (
            <form onSubmit={this.handleResetPasswordConfirmation}>
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
                <FormGroup controlId="password" bsSize="large">
                    <ControlLabel>Password</ControlLabel>
                    <FormControl
                        value={this.state.password}
                        onChange={this.handleChange}
                        type="password"
                    />
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

    renderLoginForm() {
        return (
            <div className="Login">
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
                    <FormGroup controlId="password" bsSize="large">
                        <ControlLabel>Password</ControlLabel>
                        <FormControl
                            value={this.state.password}
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
                        text="Login"
                        loadingText="Logging in…"
                    />
                    <LoaderButton
                        block
                        bsSize="large"
                        type="submit"
                        isLoading={this.state.isLoading}
                        onClick={this.handleResetPassword}
                        text="Forgot Password"
                        loadingText="Resetting password"
                    />
                </form>
            </div>
        );
    }

    render() {
        return (
            <div className="Login">
                {this.state.resetForm === false
                    ? this.renderLoginForm()
                    : this.renderConfirmationForm()}
            </div>
        );
    }
}
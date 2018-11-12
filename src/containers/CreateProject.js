import React, {Component} from "react";
import {FormGroup, FormControl, ControlLabel} from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import "./CreateProject.css";

export default class CreateProject extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            projectID: "",
            projectName: "",
            projectManager: "",
            projectDescription: ""
        };
    }

    validateForm() {
        return (
            this.state.projectID.length > 0 &&
            this.state.projectName.length > 0 &&
            this.state.projectManager.length > 0 &&
            this.state.projectDescription.length > 0
        );
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

            //create the new project
            var url = 'https://p9i6m89j01.execute-api.eu-west-2.amazonaws.com/prod/projects';
            var data = {
                projectID: this.state.projectID,
                projName: this.state.projectName,
                manager: this.state.projectManager,
                description: this.state.projectDescription,
                stat: "commencing"
            }

            fetch(url, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => res.json())
                .then(response => console.log('Success:', JSON.stringify(response)))
                .catch(error => console.error('Error:', error));


            //adds the project to the manager and sets him as a manager
            url = 'https://p9i6m89j01.execute-api.eu-west-2.amazonaws.com/prod/users/userid';
            data = {
                userID: this.state.projectManager,
                projectID: this.state.projectID,
                pos: "manager"
            }

            fetch(url, {
                method: 'PUT',
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

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <FormGroup controlId="projectID" bsSize="large">
                    <ControlLabel>Project ID</ControlLabel>
                    <FormControl
                        autoFocus
                        type="text"
                        value={this.state.projectID}
                        onChange={this.handleChange}
                    />
                </FormGroup>
                <FormGroup controlId="projectName" bsSize="large">
                    <ControlLabel>Project Name</ControlLabel>
                    <FormControl
                        autoFocus
                        type="text"
                        value={this.state.projectName}
                        onChange={this.handleChange}
                    />
                </FormGroup>
                <FormGroup controlId="projectManager" bsSize="large">
                    <ControlLabel>Project Manger</ControlLabel>
                    <FormControl
                        type="text"
                        value={this.state.projectManager}
                        onChange={this.handleChange}
                    />
                </FormGroup>
                <FormGroup controlId="projectDescription" bsSize="large">
                    <ControlLabel>Project Description</ControlLabel>
                    <FormControl
                        onChange={this.handleChange}
                        value={this.state.projectDescription}
                        componentClass="textarea"
                    />
                </FormGroup>
                <LoaderButton
                    block
                    bsSize="large"
                    disabled={!this.validateForm()}
                    type="submit"
                    isLoading={this.state.isLoading}
                    text="Create project"
                    loadingText="Creating…"
                />
            </form>
        );
    }

}
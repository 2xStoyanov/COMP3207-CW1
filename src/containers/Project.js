import React, {Component, Fragment} from "react";
import {FormGroup, FormControl, ControlLabel} from "react-bootstrap";
import {Auth} from "aws-amplify";
import LoaderButton from "../components/LoaderButton";
import "./Project.css";


export default class Project extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            projectID: "",
            userID: "",
            projectManager: "",
            projectName: "",
            projectDescription: "",
            developers: "",
            status: "",
            isManager: false,
            newDeveloper: "",
            updateProject: false,
            addUser: false,
            sendEmail: false,
            subject: "",
            content: ""
        };

        var self = this;
        this.checkManager().then(() => {
            if (self.state.projectID !== "") {
                self.getProject();
            }
        });
    }

    checkManager = async event => {
        try {
            var self = this;

            let input = await Auth.currentAuthenticatedUser().then(response => input = response.username);
            var url = 'https://p9i6m89j01.execute-api.eu-west-2.amazonaws.com/prod/users?userID=' + input;

            //gets the users project and checks if he is the project manager
            return fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => res.json())
                .then(response => {
                    self.setState({username: response.Item.userID, projectID: response.Item.projects || ""});
                    if (response.Item.pos === 'manager') {
                        self.setState({isManager: true});
                    }
                })
                .catch(error => console.error('Error:', error));

        } catch (e) {
            alert(e.message);
        }
    }


    getProject = async event => {
        try {
            var self = this;
            var url = 'https://p9i6m89j01.execute-api.eu-west-2.amazonaws.com/prod/projects?projectID=' + this.state.projectID;

            //gets the project and loads it in the form
            await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => res.json())
                .then(response => {
                    let developers = response.Item.developers ? response.Item.developers.values : "";
                    self.setState({
                        projectManager: response.Item.manager,
                        projectName: response.Item.projName,
                        projectDescription: response.Item.description,
                        developers: developers,
                        status: response.Item.stat
                    })
                })
                .catch(error => console.error('Error:', error));
        } catch (e) {
            alert(e.message);
        }
    }

    validateUpdate() {
        return (
            this.state.projectName.length > 0 &&
            this.state.projectDescription.length > 0
        );
    }

    validateSend() {
        return (
            this.state.subject.length > 0 &&
            this.state.content.length > 0
        );
    }

    validateAdd() {
        return (
            this.state.newDeveloper.length > 0
        );
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    updateProject = event => {
        this.setState({updateProject: true});
    }

    addUser = event => {
        this.setState({addUser: true});
    }

    sendEmail = event => {
        this.setState({sendEmail: true});
    }

    handleUpdate = event => {
        event.preventDefault();
        this.setState({isLoading: true});

        //updates the project data
        var url = 'https://p9i6m89j01.execute-api.eu-west-2.amazonaws.com/prod/projects';
        var data = {
            projectID: this.state.projectID,
            projName: this.state.projectName,
            description: this.state.projectDescription,
            stat: this.state.status
        };

        fetch(url, {
            method: 'PUT',
            body: JSON.stringify(data), // data can be `string` or {object}!
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
            .then(response => console.log('Success:', JSON.stringify(response)))
            .catch(error => console.error('Error:', error));

        this.setState({isLoading: false});
        window.location.reload()
    }


    handleNewDeveloper = event => {
        event.preventDefault();
        this.setState({isLoading: true});

        //adds new developer to the project
        var url = 'https://p9i6m89j01.execute-api.eu-west-2.amazonaws.com/prod/projects/projectid';
        var data = {
            projectID: this.state.projectID,
            developer: this.state.newDeveloper
        };
        fetch(url, {
            method: 'PUT',
            body: JSON.stringify(data), // data can be `string` or {object}!
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
            .then(response => console.log('Success:', JSON.stringify(response)))
            .catch(error => console.error('Error:', error));

        //adds the project to the user
        url = 'https://p9i6m89j01.execute-api.eu-west-2.amazonaws.com/prod/users/userid';
        data = {
            userID: this.state.newDeveloper,
            projectID: this.state.projectID,
            pos: "developer"
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

        this.setState({isLoading: false});
        window.location.reload()
    }

    handleSend = event => {
        event.preventDefault();
        var self = this;

        //gets the email foreach developer and sends the email that the project manager has send
        this.state.developers.forEach(function (element) {
            var url = 'https://p9i6m89j01.execute-api.eu-west-2.amazonaws.com/prod/users?userID=' + element;

            fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => res.json())
                .then(response => {
                    var url = 'https://p9i6m89j01.execute-api.eu-west-2.amazonaws.com/prod/users/userid';
                    var data = {
                        toAddress: [response.Item.email],
                        source: "ss1g16@soton.ac.uk",
                        subject: self.state.subject,
                        content: self.state.content
                    };

                    fetch(url, {
                        method: 'POST',
                        body: JSON.stringify(data), // data can be `string` or {object}!
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then(res => res.json())
                        .then(response => console.log('Success:', JSON.stringify(response)))
                        .catch(error => console.error('Error:', error));
                })
                .catch(error => console.error('Error:', error));
        });
    }

    renderForm() {
        return (
            <form onSubmit={this.handleUpdate}>
                <FormGroup controlId="projectID" bsSize="large">
                    <ControlLabel>ProjectID</ControlLabel>
                    <FormControl
                        type="text"
                        value={this.state.projectID}
                        disabled={true}
                        onChange={this.handleChange}
                    />
                </FormGroup>
                <FormGroup controlId="projectManager" bsSize="large">
                    <ControlLabel>Project Manager</ControlLabel>
                    <FormControl
                        type="text"
                        disabled={true}
                        value={this.state.projectManager}
                        onChange={this.handleChange}
                    />
                </FormGroup>
                <FormGroup controlId="projectName" bsSize="large">
                    <ControlLabel>Project Name</ControlLabel>
                    <FormControl
                        type="text"
                        disabled={true}
                        value={this.state.projectName}
                        onChange={this.handleChange}
                    />
                </FormGroup>
                <FormGroup controlId="status" bsSize="large">
                    <ControlLabel>Project status</ControlLabel>
                    <FormControl
                        type="text"
                        disabled={true}
                        value={this.state.status}
                        onChange={this.handleChange}
                    />
                </FormGroup>
                <FormGroup controlId="projectDescription" bsSize="large">
                    <ControlLabel>Project Description</ControlLabel>
                    <FormControl
                        componentClass="textarea"
                        disabled={true}
                        value={this.state.projectDescription}
                        onChange={this.handleChange}
                    />
                </FormGroup>
                <FormGroup controlId="developers" bsSize="large">
                    <ControlLabel>Developers</ControlLabel>
                    <FormControl
                        type="text"
                        disabled={true}
                        value={this.state.developers}
                        onChange={this.handleChange}
                    />
                </FormGroup>
                {this.state.isManager ?
                    <Fragment>
                        <LoaderButton
                            block
                            bsSize="large"
                            type="submit"
                            isLoading={this.state.isLoading}
                            text="Add new developer"
                            onClick={this.addUser}
                            loadingText="Loading…"
                        />
                        <LoaderButton
                            block
                            bsSize="large"
                            type="submit"
                            isLoading={this.state.isLoading}
                            text="Update project"
                            onClick={this.updateProject}
                            loadingText="Loading…"
                        />
                        <LoaderButton
                            block
                            bsSize="large"
                            type="submit"
                            isLoading={this.state.isLoading}
                            text="Send Email"
                            onClick={this.sendEmail}
                            loadingText="Loading…"
                        />
                    </Fragment> :
                    <Fragment>
                    </Fragment>
                }
            </form>
        );
    }

    renderUpdateForm() {
        return (
            <form onSubmit={this.handleUpdate}>
                <FormGroup controlId="projectName" bsSize="large">
                    <ControlLabel>Project Name</ControlLabel>
                    <FormControl
                        type="text"
                        value={this.state.projectName}
                        onChange={this.handleChange}
                    />
                </FormGroup>
                <FormGroup controlId="projectDescription" bsSize="large">
                    <ControlLabel>Project Description</ControlLabel>
                    <FormControl
                        componentClass="textarea"
                        value={this.state.projectDescription}
                        onChange={this.handleChange}
                    />
                </FormGroup>
                <FormGroup controlId="status">
                    <ControlLabel>Select status</ControlLabel>
                    <FormControl value={this.state.status === "" ? "Select status" : this.state.status}
                                 componentClass="select" placeholder="Select status"
                                 onChange={this.handleChange}>
                        <option disabled value="Select status">Select status</option>
                        <option value="commencing">commencing</option>
                        <option value="active">active</option>
                        <option value="completed"> completed</option>
                    </FormControl>
                </FormGroup>
                <LoaderButton
                    block
                    bsSize="large"
                    type="submit"
                    isLoading={this.state.isLoading}
                    text="Update project"
                    disabled={!this.validateUpdate()}
                    loadingText="Updating…"
                />
            </form>
        );
    }

    renderAddForm() {
        return (
            <form onSubmit={this.handleNewDeveloper}>
                <FormGroup controlId="newDeveloper" bsSize="large">
                    <ControlLabel>New developer</ControlLabel>
                    <FormControl
                        type="text"
                        value={this.state.newDeveloper}
                        onChange={this.handleChange}
                    />
                </FormGroup>
                <LoaderButton
                    block
                    bsSize="large"
                    type="submit"
                    isLoading={this.state.isLoading}
                    text="Add new developer"
                    disabled={!this.validateAdd()}
                    loadingText="Loading…"
                />
            </form>
        );
    }

    renderSendForm() {
        return (
            <form onSubmit={this.handleSend}>
                <FormGroup controlId="subject" bsSize="large">
                    <ControlLabel>Email subject</ControlLabel>
                    <FormControl
                        type="text"
                        value={this.state.subject}
                        onChange={this.handleChange}
                    />
                </FormGroup>
                <FormGroup controlId="content" bsSize="large">
                    <ControlLabel>Email content</ControlLabel>
                    <FormControl
                        componentClass="textarea"
                        value={this.state.content}
                        onChange={this.handleChange}
                    />
                </FormGroup>
                <LoaderButton
                    block
                    bsSize="large"
                    type="submit"
                    isLoading={this.state.isLoading}
                    disabled={!this.validateSend()}
                    text="Send email"
                    loadingText="Sending…"
                />
            </form>
        );
    }

    render() {
        return (
            <div className="Profile">
                {!this.state.addUser && !this.state.updateProject && !this.state.sendEmail
                    ? this.renderForm()
                    : (!this.state.addUser && this.state.updateProject && !this.state.sendEmail ?
                            this.renderUpdateForm()
                            : (this.state.addUser && !this.state.updateProject && !this.state.sendEmail ?
                                this.renderAddForm()
                                : this.renderSendForm())
                    )}
            </div>
        );
    }
}
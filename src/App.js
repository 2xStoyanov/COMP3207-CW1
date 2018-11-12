import React, {Component, Fragment} from "react";
import {Link, withRouter} from "react-router-dom";
import {Nav, Navbar, NavItem} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";
import {Auth} from "aws-amplify";
import "./App.css";
import Routes from "./Routes";


class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isAuthenticated: false,
            isAuthenticating: true,
            isAdmin: false
        };
    }

    async componentDidMount() {
        try {
            var self = this;
            await Auth.currentSession();

            let input = await Auth.currentAuthenticatedUser().then(response => input = response.username);
            let url = 'https://p9i6m89j01.execute-api.eu-west-2.amazonaws.com/prod/users?userID=' + input;

            this.userHasAuthenticated(true);

            //check if the user is admin
            fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => res.json())
                .then(response => {
                    if (response.Item.pos === 'admin') {
                        self.setState({isAdmin: true});
                    }
                })
                .catch(error => console.error('Error:', error));
        }
        catch (e) {
            if (e !== 'No current user') {
                alert(e);
            }
        }

        this.setState({isAuthenticating: false});
    }

    userHasAuthenticated = authenticated => {
        this.setState({isAuthenticated: authenticated});
    }

    handleLogout = async event => {
        await Auth.signOut();

        this.userHasAuthenticated(false);

        this.props.history.push("/login");
    }

    render() {
        const childProps = {
            isAuthenticated: this.state.isAuthenticated,
            userHasAuthenticated: this.userHasAuthenticated
        };

        return (
            !this.state.isAuthenticating &&
            <div className="App container">
                <Navbar fluid collapseOnSelect>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <Link to="/">CW1</Link>
                        </Navbar.Brand>
                        <Navbar.Toggle/>
                    </Navbar.Header>
                    <Navbar.Collapse>
                        <Nav pullRight>
                            {this.state.isAuthenticated
                                ? this.state.isAdmin ?
                                    <Fragment>
                                        <LinkContainer to="/project">
                                            <NavItem>Project</NavItem>
                                        </LinkContainer>
                                        <LinkContainer to="/profile">
                                            <NavItem>Profile</NavItem>
                                        </LinkContainer>
                                        <LinkContainer to="/signup">
                                            <NavItem>Signup new user</NavItem>
                                        </LinkContainer>
                                        <LinkContainer to="/createproject">
                                            <NavItem>Create new project</NavItem>
                                        </LinkContainer>
                                        <NavItem onClick={this.handleLogout}>Logout</NavItem>
                                    </Fragment> :
                                    <Fragment>
                                        <LinkContainer to="/project">
                                            <NavItem>Project</NavItem>
                                        </LinkContainer>
                                        <LinkContainer to="/profile">
                                            <NavItem>Profile</NavItem>
                                        </LinkContainer>
                                        <NavItem onClick={this.handleLogout}>Logout</NavItem>
                                    </Fragment>
                                : <Fragment>
                                    <LinkContainer to="/login">
                                        <NavItem>Login</NavItem>
                                    </LinkContainer>
                                </Fragment>
                            }
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                <Routes childProps={childProps}/>
            </div>
        );
    }
}

export default withRouter(App);
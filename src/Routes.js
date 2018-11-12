import React from "react";
import {Route, Switch} from "react-router-dom";
import Home from "./containers/Home";
import Login from "./containers/Login";
import Signup from "./containers/Signup";
import CreateProject from "./containers/CreateProject";
import Profile from "./containers/Profile";
import Project from "./containers/Project";
import NotFound from "./containers/NotFound";
import AppliedRoute from "./components/AppliedRoute";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";

export default ({childProps}) =>
    <Switch>
        <AppliedRoute path="/" exact component={Home} props={childProps}/>
        <UnauthenticatedRoute path="/login" exact component={Login} props={childProps}/>
        <AuthenticatedRoute path="/signup" exact component={Signup} props={childProps}/>
        <AuthenticatedRoute path="/profile" exact component={Profile} props={childProps}/>
        <AuthenticatedRoute path="/project" exact component={Project} props={childProps}/>
        <AuthenticatedRoute path="/createproject" exact component={CreateProject} props={childProps}/>
        <Route component={NotFound}/>
    </Switch>;
import React from "react";
import {BrowserRouter as Router,Redirect,Route, Switch} from 'react-router-dom';

// components
import Layout from "./Layout";

// pages
import Error from "../pages/error";
// import Login from "../pages/login";
import Login from "../pages/login/custom";
// context
import { useUserState } from "../context/UserContext";
import './App.css';
export default function App() {
  // global
  var { isAuthenticated, isAdmin, isManager, isEngineering} = useUserState();
  let defaultRedirect ;
  if(isAdmin){
    defaultRedirect = "/app/accounts";
  } else if(isManager){
    defaultRedirect = "/app/quotations";
  } else if(isEngineering){
    defaultRedirect = "/app/orders";
  } else{
    defaultRedirect = "/login";
  }
  return (
    <div>
        <Router>
          <>
            <Switch>
              <Route exact path="/" render={() => <Redirect to={defaultRedirect}  />} />
              <Route exact path="/error" component={Error} />
              <PublicRoute path="/login" component={Login}/>
              <Route
                exact
                path="/app"
                render={() => <Redirect to="/app/accounts" />}
              />
              <PrivateRoute path="/app" component={Layout}/>
            </Switch>
            
          </>
        </Router>
    </div>
  );

  function PrivateRoute({ component, ...rest }) {
    return (
      <Route
        {...rest}
        render={props =>
          isAuthenticated ? (
            React.createElement(component, props)
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: {
                  from: props.location,
                },
              }}
            />
          )
        }
      />
    );
  }

  function PublicRoute({ component, ...rest }) {
    return (
      <Route
        {...rest}
        render={props =>
          isAuthenticated ? (
            <Redirect
              to={{
                pathname: "/",
              }}
            />
          ) : (
            React.createElement(component, props)
          )
        }
      />
    );
  }
}

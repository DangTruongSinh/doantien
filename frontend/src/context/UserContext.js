import React from "react";
import UserService from '../api/UserService';

var UserStateContext = React.createContext();
var UserDispatchContext = React.createContext();

function userReducer(state, action) {
  switch (action.type) {
    case "LOGIN_SUCCESS_ADMIN":
        return { ...state, isAdmin:true, isEngineering:false, isManager:false, isAuthenticated: true};
    case "LOGIN_SUCCESS_MANAGER":
        return { ...state, isAdmin:false, isEngineering:false, isManager:true, isAuthenticated: true};
    case "LOGIN_SUCCESS_ENGINEERING":
        return { ...state, isAdmin:false, isEngineering:true, isManager:false, isAuthenticated: true};
    case "SIGN_OUT_SUCCESS":
        return { ...state, isAuthenticated: false};
    default: {
        throw new Error(`Unhandled action type: ${action.type}`);
    }
}
}

function UserProvider({ children }) {
  var [state, dispatch] = React.useReducer(userReducer, {
    isAuthenticated: !!localStorage.getItem("id_token"),
    isAdmin: (localStorage.getItem("isAdmin") === 'true'),
    isManager: (localStorage.getItem("isManager") === 'true'),
    isEngineering: (localStorage.getItem("isEngineering") === 'true'),
    isloader: false
  });
  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
}

function useUserState() {
  var context = React.useContext(UserStateContext);
  if (context === undefined) {
    throw new Error("useUserState must be used within a UserProvider");
  }
  return context;
}

function useUserDispatch() {
  var context = React.useContext(UserDispatchContext);
  if (context === undefined) {
    throw new Error("useUserDispatch must be used within a UserProvider");
  }
  return context;
}

export { UserProvider, useUserState, useUserDispatch, loginUser, signOut };

// ###########################################################

function loginUser(dispatch, login, password, history, setIsValid, setLoad) {
  if (!!login && !!password) {
      setLoad(true);
      let type;
      let url;
      let isAdmin = false;
      let isManager = false;
      let isEngineer = false;
      UserService.login(login, password).then(r => {
          console.log(r.data);
          if(r.data.roles === 'ADMIN'){
            type = "LOGIN_SUCCESS_ADMIN";
            url = "/app/accounts";
            isAdmin = true;
          } else if(r.data.roles === 'MANAGER'){
              type = "LOGIN_SUCCESS_MANAGER";
              url = "/app/quotations";
              isManager = true;
          } else if(r.data.roles === 'ENGINEERING'){
              type = "LOGIN_SUCCESS_ENGINEERING";
              url = "/app/orders";
              isEngineer = true;
          }
          localStorage.setItem('id_token', r.data.accessToken);
          localStorage.setItem('email', r.data.email);
          localStorage.setItem('username', r.data.username);
          localStorage.setItem('isAdmin', isAdmin);
          localStorage.setItem('isManager', isManager);
          localStorage.setItem('isEngineering', isEngineer);
          dispatch({ type: `${type}` });
          setLoad(false);
          history.push(`${url}`);
      }).catch(e => {
          // fix case message to display system not working 
          console.log(e);
          setLoad(false);
          setIsValid(true);
      })
      
  } else {
     // dispatch({ type: "LOGIN_FAILURE" });
  }
}

function signOut(dispatch, history) {
  localStorage.removeItem("id_token");
  dispatch({ type: "SIGN_OUT_SUCCESS" });
  history.push("/login");
}

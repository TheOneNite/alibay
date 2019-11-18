import React, { Component } from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";
import Login from "./Login.jsx";
import Signup from "./Signup.jsx";
import Nav from "./Nav.jsx";
import CreateItem from "./CreateItem.jsx";

let login = () => {
  return <Login />;
};

let signup = () => {
  return <Signup />;
};

let createItem = () => {
  return <CreateItem />;
};

class App extends Component {
  render = () => {
    return (
      <BrowserRouter>
        <div>
          <Nav />
          <Route exact={true} path="/login" render={login} />
          <Route exact={true} path="/signup" render={signup} />
          <Route exact={true} path="/sell" render={createItem} />
        </div>
      </BrowserRouter>
    );
  };
}

export default App;

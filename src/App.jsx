import React, { Component } from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";
import Login from "./Login.jsx";
import Signup from "./Signup.jsx";
import Nav from "./Nav.jsx";
import ItemDetails from "./ItemDetails.jsx";
import ItemSearch from "./ItemSearch.jsx";
import CreateItem from "./CreateItem.jsx";
import DisplayedItems from "./DisplayedItems.jsx";
import Search from "./Search.jsx";

let login = () => {
  return <Login />;
};

let signup = () => {
  return <Signup />;
};

let sample = () => {
  return <ItemSearch />;
};

let sampleItem = () => {
  return <ItemDetails />;
};
let createItem = () => {
  return <CreateItem />;
};

let content = () => {
  return (
    <div>
      <Search />
      <DisplayedItems />
    </div>
  );
};

class App extends Component {
  render = () => {
    return (
      <BrowserRouter>
        <div>
          <Nav />
          <Link to={"/sampleSearch"}>Sample item details</Link>
          <Route exact={true} path="/" render={content} />
          <Route exact={true} path="/login" render={login} />
          <Route exact={true} path="/signup" render={signup} />
          <Route exact={true} path="/sampleitem" render={sampleItem} />
          <Route exact={true} path="/samplesearch" render={sample} />
          <Route exact={true} path="/sell" render={createItem} />
        </div>
      </BrowserRouter>
    );
  };
}

export default App;

import React, { Component } from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";
import ItemDetails from "./ItemDetails.jsx";

class App extends Component {
  render = () => {
    return <ItemDetails />;
  };
}

export default App;

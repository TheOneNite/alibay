import React, { Component } from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";
import { connect } from "react-redux";
import Login from "./Login.jsx";
import Signup from "./Signup.jsx";
import Nav from "./Nav.jsx";
import ItemDetails from "./ItemDetails.jsx";
import ItemSearch from "./ItemSearch.jsx";
import CreateItem from "./CreateItem.jsx";
import DisplayedItems from "./DisplayedItems.jsx";
import Search from "./Search.jsx";
import MyAccount from "./MyAccount.jsx";
import Cart from "./Cart.jsx";

//import history from "./History.jsx";

let login = () => {
  return <Login />;
};

let signup = () => {
  return <Signup />;
};

let createItem = () => {
  return <CreateItem />;
};
let myAccount = () => {
  console.log("my account", myAccount);
  return <MyAccount />;
};

let cart = () => {
  return (
    <div>
      <Cart />
    </div>
  );
};

let content = () => {
  return (
    <div>
      <Search />
      <DisplayedItems />
    </div>
  );
};

class UnconnectedApp extends Component {
  findItemByID = ID => {
    let candidate = this.props.items.filter(item => {
      return item.itemId === ID;
    });
    return candidate[0];
  };

  itemDetail = routerData => {
    let item = this.findItemByID(routerData.match.params.itemId);
    return <ItemDetails item={item} />;
  };
  render = () => {
    return (
      <BrowserRouter>
        <div>
          <Nav />
          <Route exact={true} path="/" render={content} />
          <Route exact={true} path="/item/:itemId" render={this.itemDetail} />
          <Route exact={true} path="/login" render={login} />
          <Route exact={true} path="/signup" render={signup} />
          <Route exact={true} path="/sell" render={createItem} />
          <Route exact={true} path="/account" render={myAccount} />
          <Route exact={true} path="/cart" render={cart} />
        </div>
      </BrowserRouter>
    );
  };
}

let mapStateToProps = st => {
  return {
    items: st.allItems
  };
};

let App = connect(mapStateToProps)(UnconnectedApp);

export default App;

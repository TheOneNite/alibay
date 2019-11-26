import React, { Component } from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";
import { connect } from "react-redux";
import Login from "./Login.jsx";
import Signup from "./Signup.jsx";
import Nav from "./Nav.jsx";
import ItemDetails from "./ItemDetails.jsx";
import CreateItem from "./CreateItem.jsx";
import DisplayedItems from "./DisplayedItems.jsx";
import Search from "./Search.jsx";
import MyAccount from "./MyAccount.jsx";
import Cart from "./Cart.jsx";
import PastOrders from "./PastOrders.jsx";
import Order from "./Order.jsx";
import Footer from "./Footer.jsx";

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
    <div className="content">
      <Search />

      <DisplayedItems />
    </div>
  );
};

let pastOrders = () => {
  console.log("past orders");
  return (
    <div>
      <PastOrders />
    </div>
  );
};

let order = routerData => {
  console.log("order");
  let orderId = routerData.match.params.orderId;
  return (
    <div>
      <Order orderId={orderId} />
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
  checkCookie = async () => {
    const res = await fetch("/autologin", {
      method: "GET",
      credentials: "include"
    });
    let bod = await res.text();
    bod = JSON.parse(bod);
    if (bod.success) {
      console.log("found active login session");
      this.props.dispatch({
        type: "login-success",
        currentUser: bod.user.displayName
      });
      let response = await fetch("/fetch-cart", {
        method: "GET"
      });
      let body = await response.text();
      let cart = JSON.parse(body);
      this.props.dispatch({ type: "updateCart", cart });
    }
  };
  render = () => {
    this.checkCookie();
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
          <Route exact={true} path="/orders" render={pastOrders} />
          <Route exact={true} path="/orders/:orderId" render={order} />
          <Footer />
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

import React, { Component } from "react";
import { connect } from "react-redux";

class UnconnectedAddToCart extends Component {
  updateCart = async () => {
    console.log("updating cart...");
    let response = await fetch("/fetch-cart", {
      method: "GET"
    });
    let body = await response.text();
    let returnedCart = JSON.parse(body);
    console.log("returnedCart", returnedCart);
    this.props.dispatch({ type: "updateCart", cart: returnedCart });
  };

  addToCart = async () => {
    console.log("attempting to add to cart");
    let data = new FormData();
    data.append("adding", true);
    data.append("itemId", this.props.itemId);
    console.log("itemId: ", this.props.itemId);
    let res = await fetch("/cart", {
      method: "POST",
      body: data,
      credentials: "include"
    });
    let body = await res.text();
    let response = JSON.parse(body);
    if (!response.success) {
      alert("add to cart failed");
      return;
    }
    alert("item added to cart");
    this.updateCart();
  };

  renderButton = () => {
    if (this.props.isLoggedIn) {
      return <button onClick={this.addToCart}>Add to cart</button>;
    }
    return <button disabled={true}>Log in to add to cart</button>;
  };
  render() {
    return this.renderButton();
  }
}
let mapStateToProps = st => {
  return {
    isLoggedIn: st.loggedIn
  };
};

let AddToCart = connect(mapStateToProps)(UnconnectedAddToCart);

export default AddToCart;

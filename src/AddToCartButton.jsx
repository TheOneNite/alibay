import React, { Component } from "react";
import { connect } from "react-redux";

class UnconnectedAddToCart extends Component {
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

import React, { Component } from "react";

class RemoveFromCart extends Component {
  remove = async () => {
    console.log("attempting remove from cart");
    let data = new FormData();
    data.append("adding", false);
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
      console.log("remove from cart failed");
      return;
    }
    console.log("item removed from cart");
  };

  render() {
    return <button onClick={this.remove}>remove</button>;
  }
}

export default RemoveFromCart;

import React, { Component } from "react";
import styled from "styled-components";
import formatMoney from "./formatMoney.js";
import RemoveFromCart from "./RemoveFromCartButton.jsx";

const CartItem = styled.div`
  display: grid;
`;

class ItemCart extends Component {
  render() {
    let item = this.props.item;
    return (
      <CartItem>
        <div>{item.title}</div>
        <img src={item.smallImage} />
        <div>{formatMoney(item.price)}</div>
        <RemoveFromCart />
      </CartItem>
    );
  }
}

export default ItemCart;

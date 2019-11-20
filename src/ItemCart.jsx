import React, { Component } from "react";
import styled from "styled-components";
import formatMoney from "./formatMoney.js";
import RemoveFromCart from "./RemoveFromCartButton.jsx";

const CartItem = styled.div`
  display: grid;
  grid-template-columns: 1fr 50px 60px 75px;
  padding: 2px;
  height: 25px;
  border: 1px solid;
  div {
    text-align: right;
    vertical-align: middle;
  }
`;

class ItemCart extends Component {
  render() {
    let item = this.props.item;
    return (
      <CartItem>
        <div>{item.title}</div>
        <img height="25px" src={item.smallImage} />
        <RemoveFromCart itemId={item.itemId} />
        <div>{formatMoney(item.price)}</div>
      </CartItem>
    );
  }
}

export default ItemCart;

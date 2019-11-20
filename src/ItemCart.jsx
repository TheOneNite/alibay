import React, { Component } from "react";
import styled from "styled-components";
import formatMoney from "./formatMoney.js";
import RemoveFromCart from "./RemoveFromCartButton.jsx";

const CartItem = styled.div`
  display: grid;
  grid-template-columns: 50px 250px 60px 75px;
  padding: 2px;
  height: 25px;
  border: 1px solid;
  div {
    vertical-align: middle;
  }
  .price {
    text-align: right;
  }
`;

class ItemCart extends Component {
  render() {
    let item = this.props.item;
    return (
      <CartItem>
        <img height="25px" src={item.smallImage} />
        <div>{item.title}</div>
        <RemoveFromCart itemId={item.itemId} />
        <div className="price">{formatMoney(item.price)}</div>
      </CartItem>
    );
  }
}

export default ItemCart;

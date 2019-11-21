import React, { Component } from "react";
import styled from "styled-components";
import formatMoney from "./formatMoney.js";
import RemoveFromCart from "./RemoveFromCartButton.jsx";

const CartItem = styled.div`
  display: grid;

  grid-template-columns: 50px 250px 60px 75px;
  padding: 40px;
  height: 25px;
  border-bottom: 1px solid;
  align-content: center;
  div,
  img {
    display: grid;
    align-items: center;
    padding: 5px;
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
        <img height="100%" width="100%" src={item.smallImage} />

        <div> {item.title}</div>
        <div className="price">{formatMoney(item.price)}</div>
        <RemoveFromCart itemId={item.itemId} />
      </CartItem>
    );
  }
}

export default ItemCart;

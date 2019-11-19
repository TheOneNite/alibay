import { connect } from "react-redux";
import React, { Component } from "react";
import ItemSearch from "./ItemSearch.jsx";
import styled from "styled-components";
import StripeCheckout from "react-stripe-checkout";

const SearchDisplay = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

class UnconnecteCart extends Component {
  constructor(props) {
    super(props);
    this.state = { cartItems: [] };
  }
  componentDidMount() {
    let fetchAll = async () => {
      let response = await fetch("/cart", {
        method: "GET"
      });
      let body = await response.text();
      let returnedCart = JSON.parse(body);
      console.log("returnedCart", returnedCart);
      this.setState({ ...this.state, cartItems: returnedCart });
      return;
    };
    fetchAll();
  }

  render = () => {
    return (
      <>
        <SearchDisplay>
          {this.state.cartItems.map(item => {
            //display items
            return (
              <div>
                <ItemSearch key={item.itemId} item={item} />
              </div>
            );
          })}
        </SearchDisplay>
        {/* <StripeCheckout>
          <button>Checkout</button>
        </StripeCheckout> */}
      </>
    );
  };
}

let Cart = connect()(UnconnecteCart);
export default Cart;

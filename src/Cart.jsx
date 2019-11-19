import { connect } from "react-redux";
import React, { Component } from "react";
import ItemSearch from "./ItemSearch.jsx";
import styled from "styled-components";
import StripeCheckout from "react-stripe-checkout";
import formatMoney from "./formatMoney.js";
import { withRouter } from "react-router-dom";

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

  sendData = async (res, event) => {
    let total = 0;
    this.state.cartItems.forEach(item => {
      total = total + item.price;
    });

    let cart = this.state.cartItems.map(item => {
      return item.itemId;
    });
    console.log(cart);

    let stringedCart = JSON.stringify(cart);

    event.preventDefault();
    let data = new FormData();
    data.append("token", res);
    data.append("total", total);
    data.append("cart", stringedCart);

    let response = await fetch("/checkout", {
      method: "POST",
      body: data,
      credentials: "include"
    });
    let responseBody = await response.text();
    console.log("responseBody from create itenm", responseBody);
    let body = JSON.parse(responseBody);
    console.log("parsed checkout body", body);
    if (!body.success) {
      alert("checkout failed");
      return;
    }
    // this.props.dispatch({
    //   type: "item-success"
    // });
    this.props.history.push("/orders");
  };

  onToken = res => {
    console.log("On token called");
    console.log(res.id);
    this.sendData(res.id, event);
  };

  render = () => {
    let total = 0;
    this.state.cartItems.forEach(item => {
      total = total + item.price;
    });

    return (
      <>
        <SearchDisplay>
          {this.state.cartItems.map(item => {
            //display items
            return (
              <div key={item.itemId}>
                <ItemSearch item={item} />
              </div>
            );
          })}
        </SearchDisplay>
        <div>Cart Total: {formatMoney(total)}</div>
        <StripeCheckout
          amount={total}
          name="Stuff Zone"
          stripeKey="pk_test_Hix3x69AC2ga6zwVuJn5Ya1i00PmSOBgCh"
          currency="USD"
          email="no@dice.com"
          token={res => this.onToken(res)}
        >
          <button>Checkout</button>
        </StripeCheckout>
      </>
    );
  };
}

let Cart = connect()(UnconnecteCart);
export default withRouter(Cart);

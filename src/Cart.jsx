import { connect } from "react-redux";
import React, { Component } from "react";
import ItemCart from "./ItemCart.jsx";
import styled from "styled-components";
import StripeCheckout from "react-stripe-checkout";
import formatMoney from "./formatMoney.js";
import { withRouter } from "react-router-dom";

const CartDisplay = styled.div`
  width: 80vwmax;
  border: 2px solid;
  background-color: rgba(255, 255, 255, 0.5);

  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  border-radius: 10px;
`;
const Canvas = styled.div`
  display: flex;
  justify-content: center;
  padding: 10px;
`;
const Price = styled.div`
  display: flex;
  justify-content: flex-end;

  div {
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    border: 2px solid;
    border-top: 1px;
    padding: 2px;
    div {
      border: 0px;
      box-shadow: none;
    }
  }
`;

class UnconnectedCart extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    let fetchAll = async () => {
      let response = await fetch("/fetch-cart", {
        method: "GET"
      });
      let body = await response.text();
      let returnedCart = JSON.parse(body);
      console.log("returnedCart", returnedCart);
      this.props.dispatch({ type: "updateCart", cart: returnedCart });
      return;
    };
    fetchAll();
  }

  sendData = async (res, event) => {
    let total = 0;
    this.props.cartItems.forEach(item => {
      total = total + item.price;
    });

    let cart = this.props.cartItems.map(item => {
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
    this.props.cartItems.forEach(item => {
      total = total + item.price;
    });

    return (
      <Canvas>
        <div>
          <CartDisplay>
            {this.props.cartItems.map(item => {
              //display items
              return (
                <div key={item.itemId}>
                  <ItemCart item={item} />
                </div>
              );
            })}
          </CartDisplay>
          <Price>
            <div>
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
            </div>
          </Price>
        </div>
      </Canvas>
    );
  };
}

let mapStateToProps = st => {
  return {
    cartItems: st.cart
  };
};

let Cart = connect(mapStateToProps)(UnconnectedCart);
export default withRouter(Cart);

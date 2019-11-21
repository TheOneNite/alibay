import React, { Component } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { withRouter } from "react-router-dom";

const AddButton = styled.button`
  border: none;
  display: flex;
  padding: 15px;
  border-radius: 4px;
  top: 0;
  left: 280px;
  width: 150px;
  height: 50px;
  color: white;
  background-color: #696969;
  #check {
    stroke-dasharray: 180;
    stroke-dashoffset: 180;
    transition: stroke-dashoffset 0.5s;
  }
  .icon {
    margin: 5px;
  }
`;

class UnconnectedAddToCart extends Component {
  constructor(props) {
    super(props);
    this.state = { status: "none" };
  }
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
    this.setState({ status: "loading" }, async () => {
      const cartCheck = this.props.cart.filter(item => {
        return item.itemId === this.props.itemId;
      });
      if (cartCheck.length > 0) {
        console.log("item already in cart");
        this.setState({ status: "fail" });
        return;
      }
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
        this.setState({ status: "fail" });
        return;
      }
      this.setState({ status: "success" });
    });
    this.updateCart();
  };
  renderIcon = () => {
    console.log("rendering icon");
    switch (this.state.status) {
      case "none": {
        return <></>;
      }
      case "loading": {
        console.log("renderload");
        return (
          <svg width="12" height="12">
            <circle
              cx="6"
              cy="6"
              r="6"
              stroke="whitesmoke"
              strokeWidth="4"
              strokeDasharray="180"
              fill="transparent"
              className="icon"
            />
            <animateTransform
              attributeType="xml"
              attributeName="transform"
              type="rotate"
              from="0"
              to="360"
              dur="1s"
              repeatCount="indefinite"
            />
          </svg>
        );
      }
      case "success": {
        console.log("rendercheck");
        return (
          <svg
            id="check"
            width="12px"
            height="12px"
            viewBox="0 0 99 73"
            fill="none"
            className="icon"
          >
            <path d="M1 27L39 71L98 1" stroke="whitesmoke" strokeWidth="10">
              <animate
                attributeName="stroke-dashoffset"
                values="180;0"
                dur="0.9s"
                repeatCount="once"
              />
            </path>
          </svg>
        ); //this will be the checkmark
      }
      case "fail":
        {
          return (
            <svg
              width="12px"
              height="12px"
              viewBox="0 0 61 79"
              fill="none"
              className="icon"
            >
              <path
                id="cross"
                d="M1 77.5L60 1M1 1L60 77.5"
                stroke="whitesmoke"
                strokeWidth="20px"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  values="180;0"
                  dur=".9s"
                  repeatCount="once"
                />
              </path>
            </svg>
          ); //this will be the X
        }
        return;
    }
  };
  login = () => {
    this.props.history.push("/login");
  };
  renderButton = () => {
    if (this.props.isLoggedIn) {
      return (
        <AddButton onClick={this.addToCart}>
          Add to Cart {this.renderIcon()}
        </AddButton>
      );
    }
    return <AddButton onClick={this.login}>Log in to add to cart</AddButton>;
  };
  render = () => {
    return this.renderButton();
  };
}
let mapStateToProps = st => {
  return {
    isLoggedIn: st.loggedIn,
    cart: st.cart
  };
};

let AddToCart = connect(mapStateToProps)(UnconnectedAddToCart);

export default withRouter(AddToCart);

import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import styled from "styled-components";
import formatMoney from "./formatMoney.js";
import addToCart from "./addToCart.js";
import { withRouter } from "react-router-dom";

const Card = styled.div`
  background-color: #ebebeb;
  background-image: url("/bg01.png");
  border-radius: 5px;
  overflow: hidden;
  margin: 15px;
  padding: 0px;
  height: 310px;
  width: 250px;
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.2), 0 4px 4px 0 rgba(0, 0, 0, 0.19);
  .link {
    text-decoration: none;
  }
  div {
    margin: 0px;
  }
  h3 {
    color: #36454f;
    margin: 0px;
    margin-left: 5px;
  }
  .image {
    height: 200px;
  }
  &:hover {
    box-shadow: 0 4px 4px 1px rgba(0, 0, 0, 0.2),
      0 4px 4px 1px rgba(0, 0, 0, 0.19);
    .add {
      left: 150px;
      cursor: pointer;
    }
  }
  .add {
    position: absolute;
    display: flex;
    padding: 5px;
    border-radius: 4px;
    top: 0;
    left: 280px;
    width: 150px;
    height: 50px;
    color: white;
    background-color: #696969;
    transition: left 0.3s;
  }
  #check {
    stroke-dasharray: 180;
    stroke-dashoffset: 180;
    transition: stroke-dashoffset 0.5s;
  }
`;
const Image = styled.img`
  background-color: rgb(170, 170, 170);
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
const PriceDiv = styled.div`
  position: relative;
  div {
    padding: 5px;
  }
`;

const Description = styled.div`
  padding: 10px;
`;

class UnconnectedItemSearch extends Component {
  constructor(props) {
    super(props);
    this.state = { status: "none" }; //default, loading, success, fail
  }
  renderIcon = () => {
    switch (this.state.status) {
      case "none": {
        return <></>;
      }
      case "loading": {
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
        return (
          <svg
            id="check"
            width="12px"
            height="12px"
            viewBox="0 0 99 73"
            fill="none"
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
          return; //this will be the X
        }
        return;
    }
  };
  renderButton = () => {
    if (!this.props.isLoggedIn) {
      return (
        <div className="add" onClick={this.clickHandler}>
          log in to buy
        </div>
      );
    }
    return (
      <div className="add" onClick={this.clickHandler}>
        add to cart
        <div className="loading">{this.renderIcon()}</div>
      </div>
    );
  };
  renderDesc = desc => {
    if (desc.length > 50) {
      return desc.slice(0, 50) + "...";
    }
    return desc;
  };
  clickHandler = async () => {
    if (!this.props.isLoggedIn) {
      console.log("to login page");
      this.props.history.push("/login");
      return;
    }
    console.log("...click handler, adding to cart: ", this.props.item.itemId);
    this.setState({ status: "loading" });
    let newCart = await addToCart(this.props.item.itemId);
    this.props.dispatch({ type: "updateCart", cart: newCart });
    this.setState({ status: "success" });
  };
  render() {
    let item = this.props.item;
    return (
      <Card>
        <div>
          <Link className="link" to={"/item/" + item.itemId}>
            <div className="image">
              <Image src={item.smallImage} />
            </div>
            <h3>{item.title}</h3>
          </Link>
          <Description>{this.renderDesc(item.description)}</Description>
        </div>
        <PriceDiv>
          <div>{formatMoney(item.price)}</div>
          {this.renderButton()}
        </PriceDiv>
      </Card>
    );
  }
}
let mapStateToProps = st => {
  return {
    isLoggedIn: st.loggedIn
  };
};

let ItemSearch = connect(mapStateToProps)(UnconnectedItemSearch);

export default withRouter(ItemSearch);

import React, { Component } from "react";
import { BrowserRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import styled from "styled-components";
import { withRouter } from "react-router-dom";

const NavStyles = styled.div`
  background-color: #ebebeb;
  background-image: url("/bg01.png");
  box-shadow: 0 4px 4px 1px rgba(0, 0, 0, 0.2);
  position: fixed;
  top: 0;
  margin: 0;
  padding: 0;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr repeat(6, auto);
  font-size: 1rem;
  overflow-x: scroll;
  ::-webkit-scrollbar {
    height: 5px;
  }
  ::-webkit-scrollbar-track {
    background-image: url("/bg01.png");
    background-color: #ebebeb;
  }
  ::-webkit-scrollbar-thumb {
    background: #696969;
    border-radius: 10px;
  }
  .logoContainer {
    height: 50px;
    width: 50px;
  }
  .logo {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  a {
    border-radius: 10px;
    text-decoration: none;
    color: #696969;
    padding: 1rem 2rem;
    display: flex;
    align-items: center;
    position: relative;
    text-transform: uppercase;
    font-weight: 250;
    font-size: 1em;
    background: none;
    border: 0;
    margin: 5px 0 0 0;
    cursor: pointer;
    &:hover {
      background: white;
    }
    div {
      white-space: nowrap;
      overflow: hidden;
    }
  }
`;
const Underline = styled.div`
  height: 3px;
  background: #696969;
  content: "";
  width: 0;
  position: absolute;
  transform: translateX(-50%);
  transition: width 0.4s;
  transition-timing-function: cubic-bezier(1, -0.65, 0, 1);
  left: 50%;
  margin-top: 0.75rem;
  width: ${props => (props.id === props.display ? "calc(100% - 60px)" : "0")}
  };
  @keyframes draw {
    100% {
      width: calc(100% - 60px);
    }
  }
`;

class unconnectedNav extends Component {
  constructor(props) {
    super(props);
    this.state = { display: "" };
  }
  signout = () => {
    console.log("signout pressed");
    fetch("/logout", {
      method: "GET"
    });
    this.props.dispatch({
      type: "signout"
    });
    this.props.history.push("/login");
  };
  clickHandler = ev => {
    this.setState({ display: ev.target.id });
  };
  render() {
    let me = this.props.currentUser;

    return (
      <NavStyles>
        <div className="logoContainer">
          <img className="logo" src="./logo.png" />
        </div>
        <Link id="shop" onClick={this.clickHandler} to="/">
          <div>Shop</div> <Underline id="shop" display={this.state.display} />
        </Link>
        {me && (
          <>
            <Link id="sell" onClick={this.clickHandler} to="/sell">
              <div>Sell an Item</div>
              <Underline id="sell" display={this.state.display} />
            </Link>
            <Link id="orders" onClick={this.clickHandler} to="/orders">
              <div>{me}'s Orders</div>
              <Underline id="orders" display={this.state.display} />
            </Link>
            <Link id="account" onClick={this.clickHandler} to="/account">
              <div>{me}'s Account</div>
              <Underline id="account" display={this.state.display} />
            </Link>
            <Link id="cart" onClick={this.clickHandler} to="/cart">
              <div>Cart</div>
              <Underline id="cart" display={this.state.display} />
            </Link>
            <a id="sign out" onClick={this.signout}>
              <div>Sign Out</div>
              <Underline id="sign out" display={this.state.display} />
            </a>
          </>
        )}
        {!me && (
          <Link id="sign in" onClick={this.clickHandler} to="/login">
            <div>Sign In</div>
            <Underline id="sign in" display={this.state.display} />
          </Link>
        )}
      </NavStyles>
    );
  }
}

let mapStateToProps = st => {
  return {
    currentUser: st.currentUser
  };
};

let Nav = connect(mapStateToProps)(unconnectedNav);
export default withRouter(Nav);

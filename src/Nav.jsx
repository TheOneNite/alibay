import React, { Component } from "react";
import { BrowserRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import styled from "styled-components";
import { withRouter } from "react-router-dom";

const NavStyles = styled.ul`
  background-color: #ebebeb;
  background-image: url("/bg01.png");
  box-shadow: 0 4px 4px 1px rgba(0, 0, 0, 0.2);
  position: fixed;
  top: 0;
  margin: 0;
  padding: 0;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  justify-self: end;
  font-size: 1rem;
}
  
  a,
  link,
  button,
  ul {
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
    cursor: pointer;
    &:hover {
    background: white;
  }
    /* &:focus {
      .underline {
        width: calc(100% - 60px);
      }
    } */
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
        <Link id="shop" onClick={this.clickHandler} to="/">
          Shop <Underline id="shop" display={this.state.display} />
        </Link>
        {me && (
          <>
            <Link id="sell" onClick={this.clickHandler} to="/sell">
              Sell an Item
              <Underline id="sell" display={this.state.display} />
            </Link>
            <Link id="orders" onClick={this.clickHandler} to="/orders">
              {me}'s Orders
              <Underline id="orders" display={this.state.display} />
            </Link>
            <Link id="account" onClick={this.clickHandler} to="/account">
              {me}'s Account
              <Underline id="account" display={this.state.display} />
            </Link>
            <Link id="cart" onClick={this.clickHandler} to="/cart">
              Cart
              <Underline id="cart" display={this.state.display} />
            </Link>
            <button id="sign out" onClick={this.signout}>
              Sign Out
              <Underline id="sign out" display={this.state.display} />
            </button>
          </>
        )}
        {!me && (
          <Link id="sign in" onClick={this.clickHandler} to="/login">
            Sign In
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

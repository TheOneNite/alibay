import React, { Component } from "react";
import { BrowserRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import styled from "styled-components";
import { withRouter } from "react-router-dom";

const NavStyles = styled.ul`
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: flex-end;
  justify-self: end;
  font-size: 1rem;
  a,
  link,
  button,
  ul {
    border-radius: 10px;
    text-decoration: none;
    color: #696969;
    padding: 0.5rem 1.5rem;
    margin: 0.5rem;
    display: flex;
    align-items: center;
    position: relative;
    text-transform: uppercase;
    font-weight: 250;
    font-size: 1em;
    background: none;
    border: 0;
    cursor: pointer;
    /* @media (max-width: 700px) {
      font-size: 10px;
      padding: 0 10px;
    } */
    &:before {
      content: "";
      width: 2px;
      height: 100%;
      left: 0;
      position: absolute;
      top: 0;
      bottom: 0;
    }
    &:after {
      height: 4px;
      background: white;
      content: "";
      width: 0;
      position: absolute;
      transform: translateX(-50%);
      transition: width 0.4s;
      transition-timing-function: cubic-bezier(1, -0.65, 0, 1);
      left: 50%;
      margin-top: 0.75rem;
    }
    &:hover {
      background: white;
    }
    &:focus {
      outline: none;
      background: #444;
      color: #fff;
      &:after {
        width: calc(100% - 60px);
      }
      /* @media (max-width: 700px) {
        width: calc(100% - 10px);
      } */
    }
  }
  /* @media (max-width: 1300px) {
    border-top: 1px solid grey;
    width: 100%;
    justify-content: center;
    font-size: 1.5rem;
  } */
`;

class unconnectedNav extends Component {
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

  render() {
    let me = this.props.currentUser;

    return (
      <NavStyles>
        <Link to="/">Shop</Link>
        {me && (
          <>
            <Link to="/sell">Sell an Item</Link>
            <Link to="/orders">{me}'s Orders</Link>
            <Link to="/account">{me}'s Account</Link>
            <Link to="/cart">Cart</Link>
            <button onClick={this.signout}>Sign Out</button>
          </>
        )}
        {!me && <Link to="/login">Sign In</Link>}
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

import React, { Component } from "react";
import { BrowserRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import styled from "styled-components";

const NavStyles = styled.ul`
  margin: 0;
  padding: 0;
  display: flex;
  justify-self: end;
  font-size: 2rem;
  a,
  link,
  button {
    padding: 1rem 3rem;
    display: flex;
    align-items: center;
    position: relative;
    text-transform: uppercase;
    font-weight: 250;
    font-size: 1em;
    background: none;
    border: 0;
    cursor: pointer;
    @media (max-width: 700px) {
      font-size: 10px;
      padding: 0 10px;
    }
    &:before {
      content: "";
      width: 2px;
      background: white;
      height: 100%;
      left: 0;
      position: absolute;
      top: 0;
      bottom: 0;
    }
    &:after {
      height: 2px;
      background: blue;
      content: "";
      width: 0;
      position: absolute;
      transform: translateX(-50%);
      transition: width 0.4s;
      transition-timing-function: cubic-bezier(1, -0.65, 0, 1);
      left: 50%;
      margin-top: 2rem;
    }
    &:hover,
    &:focus {
      outline: none;
      &:after {
        width: calc(100% - 60px);
      }
      @media (max-width: 700px) {
        width: calc(100% - 10px);
      }
    }
  }
  @media (max-width: 1300px) {
    border-top: 1px solid grey;
    width: 100%;
    justify-content: center;
    font-size: 1.5rem;
  }
`;

class unconnectedNav extends Component {
  signout = () => {
    console.log("signout pressed");
    this.props.dispatch({
      type: "signout"
    });
  };

  render() {
    let me = this.props.currentUser;

    return (
      <NavStyles>
        <span>{me}</span>
        <Link to="/">Shop</Link>
        {me && (
          <>
            <Link to="/sell">Sell an Item</Link>
            <Link to="/orders">Past Orders</Link>
            <Link to="/account">My Account</Link>
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
export default Nav;

import React, { Component } from "react";
import { BrowserRouter, Link } from "react-router-dom";
import { connect } from "react-redux";

class unconnectedNav extends Component {
  signout = () => {
    this.props.dispatch({
      type: "signout"
    });
  };

  render() {
    let me = this.props.currentUser;

    return (
      <div>
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
      </div>
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

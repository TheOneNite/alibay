import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

class unconnectedNav extends Component {
  render() {
    let me = this.props.currentUser;
    return (
      <div>
        <Link to="/items">
          <a>Shop</a>
        </Link>
        {me && (
          <>
            <Link to="/">Shop</Link>
            <Link to="/orders">Past Orders</Link>
            <Link href="/account">My Account</Link>
            <Signout />
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
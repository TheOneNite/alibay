import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";

class unconnectedSignup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    };
  }
  handleUsernameChange = event => {
    console.log("new username", event.target.value);
    this.setState({ username: event.target.value });
  };
  handlePasswordChange = event => {
    console.log("new password", event.target.value);
    this.setState({ password: event.target.value });
  };
  handleSubmit = async evt => {
    evt.preventDefault();
    console.log("signup form submitted");
    let data = new FormData();
    data.append("username", this.state.username);
    data.append("password", this.state.password);
    let response = await fetch("/signup", {
      method: "POST",
      body: data,
      credentials: "include"
    });
    let responseBody = await response.text();
    console.log("responseBody from login", responseBody);
    let body = JSON.parse(responseBody);
    console.log("parsed body", body);
    if (!body.success) {
      alert("Signup failed");
      return;
    }
    this.props.dispatch({
      type: "login-success",
      currentUser: this.state.username
    });
    this.props.history.push("/");
  };
  render = () => {
    return (
      <>
        <h3>Sign up for an account</h3>
        <form onSubmit={this.handleSubmit}>
          Choose your Username
          <input type="text" onChange={this.handleUsernameChange} />
          Choose your Password
          <input type="text" onChange={this.handlePasswordChange} />
          <input type="submit" />
        </form>
        <Link to={"/login/"}>Already have an account? Click Here!</Link>
      </>
    );
  };
}

let Signup = connect()(unconnectedSignup);
export default withRouter(Signup);

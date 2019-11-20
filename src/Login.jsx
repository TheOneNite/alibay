import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";

class UnconnectedLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    };
  }
  handleUsernameChange = event => {
    //console.log("new username", event.target.value);
    this.setState({ username: event.target.value });
  };
  handlePasswordChange = event => {
    //console.log("new password", event.target.value);
    this.setState({ password: event.target.value });
  };
  handleSubmit = async evt => {
    evt.preventDefault();
    console.log("login form submitted");
    let data = new FormData();
    data.append("username", this.state.username);
    data.append("password", this.state.password);
    console.log(data);
    let response = await fetch("/login", {
      method: "POST",
      body: data,
      credentials: "include"
    });
    let responseBody = await response.text();
    console.log("responseBody from login", responseBody);
    let body = JSON.parse(responseBody);
    console.log("parsed body", body);
    if (!body.success) {
      alert("login failed");
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
        <h3>Login</h3>
        <form onSubmit={this.handleSubmit}>
          Username
          <input
            type="text"
            placeholder="username"
            onChange={this.handleUsernameChange}
          />
          Password
          <input type="password" onChange={this.handlePasswordChange} />
          <input type="submit" />
        </form>
        <Link to={"/signup/"}>Need to sign up for an account? Click Here</Link>
      </>
    );
  };
}

let Login = connect()(UnconnectedLogin);

export default withRouter(Login);

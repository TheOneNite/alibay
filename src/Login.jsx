import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";
import styled from "styled-components";

let LogPop = styled.div`
  /* The Modal (background) */
  .modal {
    display: none; /* Hidden by default */
    position: fixed; /* Stay in place */
    z-index: 1; /* Sit on top */
    left: 0;
    top: 0;
    width: 100%; /* Full width */
    height: 100%; /* Full height */
    overflow: auto; /* Enable scroll if needed */
    background-color: rgb(0, 0, 0); /* Fallback color */
    background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
  }

  /* Modal Content/Box */
  .modal-content {
    background-color: #fefefe;
    border-radius: 10px;
    margin: 15% auto; /* 15% from the top and centered */
    padding: 20px;
    border: 1px solid #888;
    width: 250px; /* Could be more or less, depending on screen size */
    text-align: center;
  }
  .button {
    border-radius: 10px;
  }

  .form-holder {
    display: flex;
    justify-content: center;
    text-align: left;
    margin: 5px;
    padding: 5px;
  }

  /* The Close Button */
  .close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
  }

  .close:hover,
  .close:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
  }
`;
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
        <LogPop className="modal">
          <div className="modal-content">
            <h3>Login</h3>
            <div className="form-holder">
              <form onSubmit={this.handleSubmit}>
                Username
                <input
                  type="text"
                  placeholder="username"
                  onChange={this.handleUsernameChange}
                />
                Password
                <input type="password" onChange={this.handlePasswordChange} />
                <input type="submit" className="button" />
              </form>
            </div>
            <Link to={"/signup/"}>
              Need to sign up for an account? Click Here
            </Link>
          </div>
        </LogPop>
      </>
    );
  };
}

let Login = connect()(UnconnectedLogin);

export default withRouter(Login);

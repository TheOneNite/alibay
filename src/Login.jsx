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
    
  }

  /* Modal Content/Box */
  .modal-content {
    background-color: rgba(255, 255, 255, 0.55);
    border-radius: 10px;
    margin: 5% auto; /* 15% from the top and centered */
    padding: 20px;
    border: 1px solid #888;
    width: 300px; /* Could be more or less, depending on screen size */
    text-align: center;
    input {
      
      
      border-radius: 8px;
    }
  }
  .button {
			background-color: rgba(0,0,0,0.4);
			color: rgba(256,256,256,1);
			border:0;
			border-radius: 15px;
			margin: 15px; 
			padding: 15px ;
			width: 50%;
			font-size: 13px;
			font-weight: bold;
			cursor: pointer;
			opacity: 1;
			visibility: visible;
			-webkit-transition: all .3s ease;
			
			&:hover {
				transition: all .3s ease;
				background-color: #696969;
			}
		}
	}

  .form-holder {
    display: flex;
    justify-content: center;
    text-align: center;
    margin: 5px;
    padding: 5px;
    div {
      padding: 5px;
      margin: 5px
    }
    input {
      border: 1px solid gray;
      text-align: center;
      margin: 10px;
      padding: 3px;
      &:focus {
        outline-color: transparent;
        
      }
    }
 
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
    console.log(this.props.history);
    this.props.history.goBack();
    //this.props.history.push("/");
  };
  render = () => {
    return (
      <>
        <LogPop className="modal">
          <div className="modal-content">
            <h3>Sign-in</h3>
            <div className="form-holder">
              <form onSubmit={this.handleSubmit}>
                <input
                  type="text"
                  placeholder="Username"
                  onChange={this.handleUsernameChange}
                />

                <input
                  type="password"
                  placeholder="Password"
                  onChange={this.handlePasswordChange}
                />
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

import React, { Component } from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";
import { join } from "path";
import styled from "styled-components";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

let UpdatePop = styled.div`
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

class unconnectedMyAccount extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      oldPassword: "",
      newPassword: "",
      email: ""
    };
  }
  componentDidMount = async () => {
    //fetch the userinfo from database
    let response = await fetch("/account");
    let body = await response.text();
    let userInfo = JSON.parse(body);
    console.log("userInfo", userInfo);
    this.setState({
      username: userInfo.displayName,
      address: userInfo.location,
      payment: userInfo.paymentMethods,
      orders: userInfo.orders
    });
  };
  onChangeUsername = event => {
    this.setState({ username: event.target.value });
  };
  onChangeNewPassword = event => {
    this.setState({ newPassword: event.target.value });
  };
  onChangeOldPassword = event => {
    this.setState({ oldPassword: event.target.value });
  };
  onChangeAddress = event => {
    this.setState({ email: event.target.value });
  };
  submitHandler = evt => {
    evt.preventDefault();
    let data = new FormData();
    let update = {
      displayName: this.state.username,
      password: this.state.password,
      email: this.state.email
    };
    data.append("update", update);
    fetch("/account", { method: "POST", body: data, credentials: "include" });
  };
  submitUsername = async evt => {
    console.log("update username");
    evt.preventDefault();
    let data = new FormData();
    console.log(this.state.username);
    data.append("displayName", this.state.username);
    let response = await fetch("/account", { method: "POST", body: data });
    let body = await response.text();
    let parse = JSON.parse(body);
    if (parse.success) {
      window.alert(
        "Your Display name has been updated. Your login username remains unchanged"
      );
      this.props.history.push("/");
    } else {
      window.alert("something went wrong");
    }
  };
  submitSecurity = async evt => {
    console.log("update password");
    evt.preventDefault();
    let data = new FormData();
    data.append("oldPassword", this.state.oldPassword);
    data.append("newPassword", this.state.newPassword);
    let response = await fetch("/change-password", {
      method: "POST",
      body: data
    });
    let body = await response.text();
    let parse = JSON.parse(body);
    if (parse.success) {
      window.alert("Your password has been changed");
    } else {
      window.alert("something went wrong");
    }
  };
  submitAddress = async evt => {
    console.log("update address");
    evt.preventDefault();
    let data = new FormData();
    data.append("email", this.state.email);
    let response = await fetch("/account", { method: "POST", body: data });
    let body = await response.text();
    let parse = JSON.parse(body);
    if (parse.success) {
      window.alert("your email has been updated");
    } else {
      window.alert("something went wrong");
    }
  };

  render() {
    return (
      <UpdatePop className="modal">
        <div className="modal-content">
          <h4> Display Name Update</h4>
          <div className="form-holder">
            <form onSubmit={this.submitUsername}>
              <div>
                <input
                  type="text"
                  value={this.state.username}
                  onChange={this.onChangeUsername}
                />
              </div>
              <input type="submit" value="update" className="button" />
            </form>
          </div>
        </div>
        <div className="modal-content">
          <h4> Password Update</h4>
          <div className="form-holder">
            <form onSubmit={this.submitSecurity}>
              <div>
                <input
                  type="password"
                  placeholder="Your Old Password"
                  value={this.state.oldPassword}
                  onChange={this.onChangeOldPassword}
                />

                <input
                  type="password"
                  placeholder="Your New Password"
                  value={this.state.newPassword}
                  onChange={this.onChangeNewPassword}
                />
              </div>
              <input type="submit" value="update" className="button" />
            </form>
          </div>
        </div>
        <div className="modal-content">
          <h4> Email Update</h4>
          <div className="form-holder">
            <form onSubmit={this.submitAddress}>
              <div>
                <input
                  type="email"
                  placeholder="your@newemail.com"
                  value={this.state.email}
                  onChange={this.onChangeAddress}
                />
              </div>
              <input type="submit" value="update" className="button" />
            </form>
          </div>
        </div>
      </UpdatePop>
    );
  }
}

let mapStateToProps = st => {
  currentUser: st.currentUser;
};

let MyAccount = connect(mapStateToProps)(unconnectedMyAccount);
export default withRouter(MyAccount);

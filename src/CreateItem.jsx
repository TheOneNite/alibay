import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import formatMoney from "./formatMoney.js";
import styled from "styled-components";

const SaleForm = styled.div`
  display: flex;
  margin-top: 50px;
  margin-right: 20vw;
  margin-left: 20vw;
  justify-content: space-around;
  border: 5px solid black;
  border-radius: 15px;
  padding: 20px;
  .image-upload {
    text-align: center;
    justify-content: center;
    min-height: 40vh;
  }
  .form-data {
    justify-content: space-around;
    display: flex;
    flex-direction: column;
  }
  .wrap-horozontial {
    width: 100%;
    display: flex;
    justify-content: space-around;
  }
  .input-base {
    padding: 5px;
    box-sizing: border-box;
    background-color: inherit;
    border: 2px solid black;
    border-radius: 5px;
    margin: 5px;
    width: 100%;
  }
  .input-multi {
    padding: 5px;
    box-sizing: border-box;
    margin: 5px;
    background-color: inherit;
    border: 2px solid black;
    border-radius: 5px;
    min-height: 50px;
    width: 100%;
  }
  .button-base {
    background-color: #696969;
    border: none;
    border-radius: 7px;
    color: whitesmoke;
    font-weight: bolder;
    padding: 5px;
    margin: 10px;
    text-align: center;
  }
  .button-base:hover {
    background-color: whitesmoke;
    color: #696969;
  }
`;
class unconnectedCreateItem extends Component {
  state = {
    title: "",
    description: "",
    image: "",
    largeImage: "",
    imgMsg: "Upload an Image of your Product",
    price: "",
    city: ""
  };
  handleChange = event => {
    let { name, type, value } = event.target;
    let val = type === "number" ? parseFloat(value) : value;
    this.setState({ [name]: val });
  };

  sendData = async event => {
    event.preventDefault();
    let data = new FormData();
    let price = this.state.price * 100;
    data.append("title", this.state.title);
    data.append("user", this.props.currentUser);
    data.append("description", this.state.description);
    data.append("image", this.state.image);
    data.append("largeImage", this.state.largeImage);
    data.append("price", price);
    data.append("location", this.state.city);
    let response = await fetch("/additem", {
      method: "POST",
      body: data,
      credentials: "include"
    });
    let responseBody = await response.text();
    console.log("responseBody from create itenm", responseBody);
    let body = JSON.parse(responseBody);
    console.log("parsed body", body);
    if (!body.success) {
      alert("item creation failed");
      return;
    }
    this.props.dispatch({
      type: "item-success"
    });
    this.props.history.push("/");
  };

  uploadFile = async e => {
    console.log("uploading file");
    let files = e.target.files;
    let data = new FormData();
    data.append("file", files[0]);
    data.append("upload_preset", "stuffzone");

    let res = await fetch(
      "https://api.cloudinary.com/v1_1/stuffzone/image/upload",
      {
        method: "POST",
        body: data
      }
    );
    let file = await res.json();
    console.log(file);
    if (file.error) {
      this.setState({ imgMsg: file.error.message.split(".").shift() });
      return;
    }
    this.setState({
      image: file.secure_url,
      largeImage: file.eager[0].secure_url
    });
  };
  render() {
    let me = this.props.currentUser;
    return (
      <SaleForm>
        {!me && <h1>Must be signed in to create items to sell</h1>}
        {me && (
          <form onSubmit={this.sendData}>
            <div className="image-upload">
              {this.state.imgMsg}
              <div>
                <input
                  type="file"
                  id="file"
                  name="file"
                  placeholder="Upload an Image"
                  required
                  onChange={this.uploadFile}
                />
              </div>
              {this.state.image && (
                <img src={this.state.image} width="200" alt="Preview" />
              )}
            </div>
            <div className="form-data">
              <div>
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Title"
                  className="input-base"
                  required
                  value={this.state.title}
                  onChange={this.handleChange}
                />
              </div>

              <textarea
                id="description"
                name="description"
                placeholder="Please enter a description"
                className="input-multi"
                required
                value={this.state.description}
                onChange={this.handleChange}
              />
              <div className="wrap-horozontial">
                <input
                  type="text"
                  id="city"
                  name="city"
                  placeholder="Ships From"
                  className="input-base"
                  required
                  value={this.state.city}
                  onChange={this.handleChange}
                />
                <input
                  type="number"
                  id="price"
                  name="price"
                  placeholder="Price"
                  className="input-base"
                  required
                  value={this.state.price}
                  onChange={this.handleChange}
                />
              </div>
              <button type="submit" className="button-base">
                SUBMIT
              </button>
            </div>
          </form>
        )}
      </SaleForm>
    );
  }
}

let mapStateToProps = st => {
  return {
    currentUser: st.currentUser
  };
};

let CreateItem = connect(mapStateToProps)(unconnectedCreateItem);
export default withRouter(CreateItem);

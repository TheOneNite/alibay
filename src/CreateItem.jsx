import React, { Component } from "react";
import { connect } from "react-redux";

class unconnectedCreateItem extends Component {
  state = {
    title: "",
    description: "",
    image: "",
    largeImage: "",
    price: undefined,
    city: ""
  };
  handleChange = event => {
    let { name, type, value } = event.target;
    let val = type === "number" ? parseFloat(value) : value;
    this.setState({ [name]: val });
  };

  sendData = async event => {
    event.preventdefault();
    let data = new FormData();
    data.append("title", this.state.title);
    data.append("user", this.props.currentUser);
    data.append("description", this.state.description);
    data.append("image", this.state.image);
    data.append("largeImage", this.state.largeImage);
    data.append("price", this.state.price);
    data.append("city", this.state.city);
    let response = await fetch("/login", {
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
    this.setState({
      image: file.secure_url,
      largeImage: file.eager[0].secure_url
    });
  };
  render() {
    let me = this.props.currentUser;
    return (
      <div>
        {!me && <h1>Must be signed in to create items to sell</h1>}
        {me && (
          <form onSubmit={this.sendData}>
            Image
            <input
              type="file"
              id="file"
              name="file"
              placeholder="Upload an Image"
              required
              onChange={this.uploadFile}
            />
            {this.state.image && (
              <img src={this.state.image} width="200" alt="Preview" />
            )}
            Title
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Title"
              required
              value={this.state.title}
              onChange={this.handleChange}
            />
            Price
            <input
              type="number"
              id="price"
              name="price"
              placeholder="Price"
              required
              value={this.state.price}
              onChange={this.handleChange}
            />
            Description
            <textarea
              id="description"
              name="description"
              placeholder="Please enter a description"
              required
              value={this.state.description}
              onChange={this.handleChange}
            />
            City
            <input
              type="text"
              id="city"
              name="city"
              placeholder="City"
              required
              value={this.state.city}
              onChange={this.handleChange}
            />
            <button stype="submit">Submit</button>
          </form>
        )}
      </div>
    );
  }
}

let mapStateToProps = st => {
  return {
    currentUser: st.currentUser
  };
};

let CreateItem = connect(mapStateToProps)(unconnectedCreateItem);
export default CreateItem;

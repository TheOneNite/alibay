import React, { Component } from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";
class MyChat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chatsAsSeller: [],
      chatsAsBuyer: []
    };
  }
  componentDidMount = () => {
    let updateChats = async () => {
      console.log("update Chats");
      let response = await fetch("/getmychat", {
        method: "GET",
        credentials: "include"
      });
      let responseBody = await response.text();
      //parsed array of object {sender: "", msg:""}
      let parsed = JSON.parse(responseBody);
      console.log("response from messages", parsed);
      this.setState({
        chatsAsSeller: parsed.asSeller,
        chatsAsBuyer: parsed.asBuyer
      });
    };
    setInterval(updateChats, 1000);
  };
  handleClick = async chat => {
    //path="/chat/:sellerId$buyeIdr$itemId"
    console.log("handle click");
    let sellerId = chat.sellerId;
    let itemId = chat.itemId;
    let buyerId = chat.buyerId;
    let path = "/chat/:" + sellerId + "$" + buyerId + "$" + itemId;
    return window.open(path, "_blank", "height=400, width=300");
  };
  render() {
    return (
      <>
        <h3>my chats</h3>
        <div>
          <h5>as seller</h5>
          {this.state.chatsAsSeller.map(chat => (
            <button onClick={this.handleClick}>chat</button>
          ))}
        </div>
        <div>
          <h5>as buyer</h5>
          {this.state.chatsAsBuyer.map(chat => (
            <button onClick={this.handleClick}>chat</button>
          ))}
        </div>
      </>
    );
  }
}
export default MyChat;

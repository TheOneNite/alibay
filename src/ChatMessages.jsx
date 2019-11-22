import React, { Component } from "react";
class ChatMessages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      msgs: []
    };
  }
  componentDidMount = () => {
    let updateMessages = async () => {
      console.log("update Message");
      let chatInfo = this.props.chatInfo;
      let sellerId = chatInfo.sellerId;
      let buyerId = chatInfo.buyerId;
      let itemId = chatInfo.itemId;
      let data = new FormData();
      data.append("itemId", itemId);
      data.append("sellerId", sellerId);
      data.append("buyerId", buyerId);
      console.log("data to fetch the message", data);
      let response = await fetch("/messages", {
        method: "POST",
        body: data,
        credentials: "include"
      });
      let responseBody = await response.text();
      //parsed array of object {sender: "", msg:""}
      let parsed = JSON.parse(responseBody);
      console.log("response from messages", parsed);
      this.setState({ msgs: parsed });
    };

    setInterval(updateMessages, 500);
  };
  render = () => {
    return (
      <ul>
        {this.state.msgs.map(msg => {
          return <li>{msg.sender + ": " + msg.msg}</li>;
        })}
      </ul>
    );
  };
}
export default ChatMessages;

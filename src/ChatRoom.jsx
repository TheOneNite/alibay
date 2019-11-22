import React, { Component } from "react";
import ChatMessages from "./ChatMessages.jsx";
import ChatForm from "./ChatForm.jsx";
import MyChat from "./MyChat.jsx";
class ChatRoom extends Component {
  //props of chatroom : chatInfo: {sellerId:"", buyerId:"", itemId:""}

  render = () => {
    console.log("in chat room, chat room props", this.props.chatInfo);
    let chatInfo = this.props.chatInfo;

    return (
      <div>
        <button
          onClick={() =>
            window.open("/mychat", "_blank", "height=800, width=600")
          }
        >
          {" "}
          my chats
        </button>
        <ChatMessages chatInfo={chatInfo} />
        <ChatForm chatInfo={chatInfo} />
      </div>
    );
  };
}

export default ChatRoom;

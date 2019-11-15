import React, { Component } from "react";

class UnconnectedItemDetails extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="details container">
        <div className="item header"></div>
      </div>
    );
  }
}

let ItemDetails = connect()(UnconnectedItemDetails);

export default ItemDetails;

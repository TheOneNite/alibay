import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

/**THINGS TO DISPLAY
 * image
 * name
 * description
 * price
 * reviews
 * add to cart button
 * seller details + link
 */

class UnconnectedItemDetails extends Component {
  constructor(props) {
    super(props);
    this.props.item = {
      name: "Alfred the Cat",
      description:
        "a cute kitty. yada yada yada. a lot more details. 15 meows per minute. cleans himself and your floors. great cat. would recomment 10/10",
      img: "www.placekitten.com/100/200",
      price: 35,
      sellerID: "1337"
    };
    this.state = { display: "details" }; //can display item description, reviews, i dunno
  }
  componentDidMount() {
    let getDetails = async () => {
      let req = await fetch("SOME ENDPOINT");
      let resp = await req.text();
      let details = JSON.parse(resp);
      if (details.success === false) {
        console.log("failed to receive item details");
        return;
      }
      /**DO SOMETHING WITH THIS RESPONSE */
    };
    getDetails();
  }
  displayContent = () => {
    switch (this.state.display) {
      case "details": {
        return <div>{this.props.item.description}</div>;
      }
      case "reviews": {
        return <div>{"no reviews. Be the first!"}</div>;
      }
      case "seller": {
        return (
          <Link to={"/" + this.props.item.seller}>{this.props.item.seller}</div>
        );
      }
    }
  };
  clickHandler = ev => {
    this.setState({ display: ev.target.id });
  };

  render() {
    return (
      <div className="details container">
        <div className="detailedImage">
          <img src={this.props.item.img} />>
        </div>
        <div>
          <div className="item header">{this.props.item.name}</div>
          <div className="price">${this.props.item.price}</div>
          <div className="detailBar" display="flex">
            <button id="details" onClick={this.clickHandler}>
              details
            </button>
            <button id="reviews" onClick={this.clickHandler}>
              reviews
            </button>
            <button id="seller" onClick={this.clickHandler}>
              seller
            </button>
          </div>
          <div>{this.displayContent()}</div>
        </div>
      </div>
    );
  }
}

let ItemDetails = connect()(UnconnectedItemDetails);

export default ItemDetails;

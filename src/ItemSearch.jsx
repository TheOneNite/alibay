import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Card = styled.div`
  border: 1px solid;
`;

class ItemSearch extends Component {
  constructor(props) {
    super(props);
    this.item = {
      name: "Alfred the Cat",
      description: `a cute kitty. yada yada yada. a lot more details. 
          15 meows per minute. cleans himself and your floors. 
          great cat. would recomment 10/10`,
      img: "http://www.placekitten.com/150/200",
      price: 35,
      sellerID: "1337"
    };
  }

  render() {
    return (
      <Card>
        <Link to="/sampleitem">{this.item.name}</Link>
        <div>
          <img src={this.item.img}></img>
        </div>
        <div>{this.item.description.slice(0, 50) + "..."}</div>
        <div display="flex">
          <div>${this.item.price}</div>
          <button onClick={this.addToCart}>Add to cart</button>
        </div>
      </Card>
    );
  }
}

export default ItemSearch;

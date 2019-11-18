import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Card = styled.div`
  border: 1px solid;
  width: 250px;
  background-color: teal;
`;
const PriceDiv = styled.div`
  display: flex;
`;

class ItemSearch extends Component {
  constructor(props) {
    super(props);
    this.item = {
      name: "Alfred the Cat",
      description: `a cute kitty. yada yada yada. likes back scratches and tuna fish. 
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
          <img height="100px" src={this.item.img}></img>
        </div>
        <div>{this.item.description.slice(0, 50) + "..."}</div>
        <PriceDiv>
          <div>${this.item.price}</div>
          <button onClick={this.addToCart}>Add to cart</button>
        </PriceDiv>
      </Card>
    );
  }
}

export default ItemSearch;

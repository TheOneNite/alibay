import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";
import formatMoney from "./formatMoney.js";
import AddToCart from "./AddToCartButton.jsx";

const Card = styled.div`
  padding: 10px;
  margin: 15px;
  border: 1px solid;
  width: 250px;
  background-color: teal;
`;
const PriceDiv = styled.div`
  padding: 5px;
  display: grid;
  grid-template-columns: 1fr auto;
`;
const FlexDiv = styled.div`
  display: flex;
`;
const Description = styled.div`
  padding: 10px;
`;

class ItemSearch extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Card>
        <Link to={"/item/" + this.props.item.itemId}>
          {this.props.item.title}
        </Link>
        <FlexDiv>
          <img height="100px" src={this.props.item.smallImage} />
          <Description>
            {this.props.item.description.slice(0, 50) + "..."}
          </Description>
        </FlexDiv>
        <PriceDiv>
          <div>{formatMoney(this.props.item.price)}</div>
          <AddToCart itemId={this.props.item.itemId} />
        </PriceDiv>
      </Card>
    );
  }
}

export default ItemSearch;

import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";
import formatMoney from "./formatMoney.js";

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
  addToCart = async () => {
    console.log("attempting to add to cart");
    let data = new FormData();
    data.append("adding", true);
    data.append("itemId", this.props.item.itemId);
    console.log("itemId: ", this.props.item.itemId);
    let res = await fetch("/cart", {
      method: "POST",
      body: data,
      credentials: "include"
    });
    let body = await res.text();
    let response = JSON.parse(body);
    if (!response.success) {
      console.log("add to cart failed");
      return;
    }
    alert("item added to cart");
  };
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
          <button onClick={this.addToCart}>Add to cart</button>
        </PriceDiv>
      </Card>
    );
  }
}

export default ItemSearch;

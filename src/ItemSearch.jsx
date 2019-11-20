import React, { Component } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import formatMoney from "./formatMoney.js";
import AddToCart from "./AddToCartButton.jsx";

const Card = styled.div`
  background-color: #ebebeb;
  background-image: url("/bg01.png");
  border-radius: 5px;
  overflow: hidden;
  margin: 15px;
  padding: 0px;
  height: 310px;
  width: 250px;
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.2), 0 4px 4px 0 rgba(0, 0, 0, 0.19);
  .link {
    text-decoration: none;
  }
  div {
    margin: 0px;
  }
  h3 {
    color: #36454f;
    margin: 0px;
    margin-left: 5px;
  }
  .image {
    height: 200px;
  }
  &:hover {
    box-shadow: 0 4px 4px 1px rgba(0, 0, 0, 0.2),
      0 4px 4px 1px rgba(0, 0, 0, 0.19);
    .add {
      left: 150px;
    }
  }
  .add {
    position: absolute;
    padding: 5px;
    border-radius: 4px;
    top: 0;
    left: 280px;
    width: 150px;
    height: 50px;
    color: white;
    background-color: #696969;
    transition: left 2s;
  }
`;
const Image = styled.img`
  background-color: rgb(170, 170, 170);
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
const PriceDiv = styled.div`
  position: relative;
  div {
    padding: 5px;
  }
`;

const Description = styled.div`
  padding: 10px;
`;

class ItemSearch extends Component {
  constructor(props) {
    super(props);
  }
  renderButton = () => {
    return <div className="add">add to cart</div>;
  };
  renderDesc = desc => {
    if (desc.length > 50) {
      return desc.slice(0, 50) + "...";
    }
    return desc;
  };

  render() {
    let item = this.props.item;
    return (
      <Card>
        <div>
          <Link className="link" to={"/item/" + item.itemId}>
            <div className="image">
              <Image src={item.smallImage} />
            </div>
            <h3>{item.title}</h3>
          </Link>
          <Description>{this.renderDesc(item.description)}</Description>
        </div>
        <PriceDiv>
          <div>{formatMoney(item.price)}</div>
          {this.renderButton()}
        </PriceDiv>
      </Card>
    );
  }
}

export default ItemSearch;

import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";
import formatMoney from "./formatMoney.js";
import AddToCart from "./AddToCartButton.jsx";

// STYLED COMPONENTS

const Title = styled.div`
  margin: 5px;
  font-size: 24px;
  font-variant: small-caps;
  height: min-content;
  margin-right: 10px;
  margin-left: 10px;
`;
const ContentCard = styled.div`
  width: 33%;
  display: grid;
  grid-template-rows: auto 1fr auto;
  background-color: inherit;
  border-radius: 5px;
  margin-left: 15px;
  border: 2px solid;
  overflow: hidden;
`;
const Nav = styled.div`
  display: grid;
  grid-template-columns: 50% 50%;
`;
const SelectedNavButton = styled.button`
  padding: 5px;
  background-color: #696969;
  font-variant: small-caps;
  color: white;
  border: none;
`;
const NavButton = styled.button`
  padding: 5px;
  border-width: 0px;
  font-variant: small-caps;
  border-left: 1px solid;
  border-right: 1px solid;
  background-color: inherit;
  border-bottom: 2px solid;
  &:hover {
    background-color: whitesmoke;
  }
`;
const PurchaseDiv = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  border-top: 1px solid;
`;
const Canvas = styled.div`
  display: flex;
  margin: 20px;
  padding: 15px;
  max-width: 100vw;
  max-height: 80vh;
  .image-main {
    background-color: rgb(170, 170, 170);
    width: 66%;
    object-fit: cover;
    border-radius: 5px;
  }
  .text-detail {
    text-align: center;
    margin: 10px;
  }
  .price {
    margin: 15px;
  }
`;

class UnconnectedItemDetails extends Component {
  constructor(props) {
    super(props);
    this.state = { display: "details" };
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
        return <div>{"Seller info"}</div>;
        //<Link to={"/" + this.item.seller}>{this.item.seller}</Link>;
      }
    }
  };
  clickHandler = ev => {
    this.setState({ display: ev.target.id });
  };
  renderNavButtons = () => {
    let buttons = ["details", "seller info"];
    return buttons.map(button => {
      if (button === this.state.display) {
        return (
          <SelectedNavButton id={button} onClick={this.clickHandler}>
            {button}
          </SelectedNavButton>
        );
      }
      return (
        <NavButton id={button} onClick={this.clickHandler}>
          {button}
        </NavButton>
      );
    });
  };

  render() {
    if (this.props.item === undefined) {
      return <div>Loading Item Details....</div>;
    }
    return (
      <Canvas>
        <img src={this.props.item.largeImage} className="image-main" />
        <ContentCard>
          <Nav>{this.renderNavButtons()}</Nav>
          <div>
            <Title>{this.props.item.title}</Title>
            <div className="text-detail">{this.displayContent()}</div>
          </div>
          <PurchaseDiv>
            <div className="price" text-align="right">
              {formatMoney(this.props.item.price)}
            </div>
            <AddToCart itemId={this.props.item.itemId} />
          </PurchaseDiv>
        </ContentCard>
      </Canvas>
    );
  }
}

let ItemDetails = connect()(UnconnectedItemDetails);

export default ItemDetails;

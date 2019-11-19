import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";

// STYLED COMPONENTS
const ItemCard = styled.div``;

const Title = styled.h3`
  margin: 5px;
`;

const ContentCard = styled.div`
  width: 50vw;
  height: 100%;
  display: grid;
  grid-template-rows: auto 1fr auto;
  background-color: rgb(0, 162, 255);
  border-radius: 5px;
  border: 1px solid;
  overflow: hidden;
`;
const Nav = styled.div`
  display: grid;
  grid-template-columns: 34% 33% 33%;
`;
const SelectedNavButton = styled.button`
border-width: 0px;
border-left: 1px solid;
border-right: 1px solid;
background-color: rgb(0, 162, 255);
}
`;
const NavButton = styled.button`
  border-width: 0px;
  border-left: 1px solid;
  border-right: 1px solid;
  background-color: teal
  &:hover {
    background-color: rgb(0, 162, 255);
  }
`;
const PurchaseDiv = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  border-top: 1px solid;
`;
const AddButton = styled.button``;
const Main = styled.div`
  display: flex;
  padding: 15px;
`;

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
    this.state = { display: "details" }; //can display item description, reviews, i dunno
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
    let buttons = ["details", "reviews", "seller"];
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
  addToCart = async () => {
    let data = new FormData();
    data.append("adding", true);
    data.append("itemId", this.props.item.itemId);
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
      <Main>
        <div margin="15px" className="detailedImage">
          <img height="200px" src={this.props.item.largeImage} />
        </div>
        <ItemCard>
          <Title>{this.props.item.title}</Title>
          <ContentCard>
            <Nav>{this.renderNavButtons()}</Nav>
            <div>{this.displayContent()}</div>
            <PurchaseDiv>
              <div className="price" text-align="right">
                ${this.props.item.price}
              </div>
              <AddButton onClick={this.addToCart}>Add to cart</AddButton>
            </PurchaseDiv>
          </ContentCard>
        </ItemCard>
      </Main>
    );
  }
}

let ItemDetails = connect()(UnconnectedItemDetails);

export default ItemDetails;

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
  height: 30vh;
  background-color: rgb(0, 162, 255);
  border-radius: 5px;
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
const Main = styled.div`
  display: flex;
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
    this.item = {
      name: "Alfred the Cat",
      description: `a cute kitty. yada yada yada. a lot more details. 
        15 meows per minute. cleans himself and your floors. 
        great cat. would recomment 10/10`,
      img: "http://www.placekitten.com/150/200",
      price: 35,
      sellerID: "1337"
    };
    this.state = { display: "details" }; //can display item description, reviews, i dunno
  }
  // componentDidMount() {
  //   let getDetails = async () => {
  //     let req = await fetch("SOME ENDPOINT");
  //     let resp = await req.text();
  //     let details = JSON.parse(resp);
  //     if (details.success === false) {
  //       console.log("failed to receive item details");
  //       return;
  //     }
  //     /**DO SOMETHING WITH THIS RESPONSE */
  //   };
  //   getDetails();
  // }
  displayContent = () => {
    switch (this.state.display) {
      case "details": {
        return <div>{this.item.description}</div>;
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
    let newState = { display: ev.target.id };

    this.setState(newState);
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
  render() {
    return (
      <Main>
        <div className="detailedImage">
          <img src={this.item.img} />
        </div>
        <ItemCard>
          <Title>{this.item.name}</Title>
          <div className="price">${this.item.price}</div>
          <ContentCard>
            <Nav>{this.renderNavButtons()}</Nav>
            <div>{this.displayContent()}</div>
          </ContentCard>
        </ItemCard>
      </Main>
    );
  }
}

let ItemDetails = connect()(UnconnectedItemDetails);

export default ItemDetails;

import { connect } from "react-redux";
import React, { Component } from "react";
import ItemSearch from "./ItemSearch.jsx";
import styled from "styled-components";
import StripeCheckout from "react-stripe-checkout";

const SearchDisplay = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

class UnconnecteCart extends Component {
  constructor(props) {
    super(props);
    this.state = { allItems: [], displayItems: [] };
  }
  componentDidMount() {
    let fetchAll = async () => {
      let response = await fetch("/cart", {
        method: "GET"
      });
      let body = await response.text();
      let allItems = JSON.parse(body);
      console.log("parsed body", allItems);
      this.setState({ ...this.state, allItems });
      console.log("allItems, ", this.state.allItems);
      this.renderItems();
    };
    fetchAll();
  }

  renderItems = () => {
    let displayItems = this.state.allItems.slice(0, 6);
    this.setState({ ...this.state, displayItems });
    return this.state.displayItems;
  };
  render = () => {
    return (
      <>
        <SearchDisplay>
          {this.state.displayItems.map(item => {
            //display items
            return (
              <div>
                <ItemSearch key={item.itemId} item={item} />
              </div>
            );
          })}
        </SearchDisplay>
        {/* <StripeCheckout>
          <button>Checkout</button>
        </StripeCheckout> */}
      </>
    );
  };
}
let mapStateToProps = st => {
  return {
    items: st.displayedItems
  };
};
let Cart = connect(mapStateToProps)(UnconnecteCart);
export default Cart;

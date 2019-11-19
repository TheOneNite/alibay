import { connect } from "react-redux";
import React, { Component } from "react";
import ItemSearch from "./ItemSearch.jsx";
import styled from "styled-components";

const SearchDisplay = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

class UnconnecteDisplayedItems extends Component {
  constructor(props) {
    super(props);
    this.state = { allItems: [] };
  }
  componentDidMount() {
    let fetchAll = async () => {
      let data = new FormData();
      // data.append("search", this.props.searchQuery)
      let response = await fetch("/items", {
        method: "POST",
        body: data
      });
      let body = await response.text();
      let allItems = JSON.parse(body);
      this.setState({ ...this.state, allItems });
      console.log("allItems, ", this.state.allItems);
      this.renderItems();
    };
    fetchAll();
  }

  renderItems = () => {
    let displayItems = this.state.allItems.slice(0, 6);
    this.props.dispatch({ type: "displayItems", items: displayItems });
  };
  render = () => {
    return (
      <SearchDisplay>
        {this.props.displayItems.map(item => {
          //display items
          return (
            <div>
              <ItemSearch key={item.itemId} item={item} />
            </div>
          );
        })}
      </SearchDisplay>
    );
  };
}
let mapStateToProps = st => {
  return {
    displayItems: st.displayedItems,
    searchQuery: st.searchQuery
  };
};
let DisplayedItems = connect(mapStateToProps)(UnconnecteDisplayedItems);
export default DisplayedItems;

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
      this.props.dispatch({ type: "allItems", items: allItems });
    };
    fetchAll();
  }

  renderItems = () => {
    let displayItems = this.props.allItems.filter(item => {
      return item.title.includes(this.props.searchQuery);
    });
    return displayItems.map(item => {
      //display items
      return (
        <div key={item.itemId}>
          <ItemSearch item={item} />
        </div>
      );
    });
  };
  render = () => {
    console.log("rendering with state: ", this.state);
    return <SearchDisplay>{this.renderItems()}</SearchDisplay>;
  };
}
let mapStateToProps = st => {
  return {
    allItems: st.allItems,
    searchQuery: st.searchQuery
  };
};
let DisplayedItems = connect(mapStateToProps)(UnconnecteDisplayedItems);
export default DisplayedItems;

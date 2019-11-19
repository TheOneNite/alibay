import { connect } from "react-redux";
import React, { Component } from "react";
import ItemSearch from "./ItemSearch.jsx";

class UnconnecteDisplayedItems extends Component {
  constructor(props) {
    super(props);
    this.state = { allItems: [], displayItems: [] };
  }
  fetchAll = async () => {
    let response = await fetch("/items");
    let body = await response.text();
    let allItems = JSON.parse(body);
    this.setState({ ...this.state, allItems });
    console.log("allItems, ", this.state.allItems);
  };
  renderItems = () => {
    let displayItems = this.state.allItems.slice(0, 6);
    this.setState({ ...this.state, displayItems });
    return this.state.displayItems;
  };
  render = () => {
    if (items === undefined) {
      this.fetchAll();
    }
    return (
      <div>
        {this.props.items.map(item => {
          //display items
          return (
            <div>
              <ItemSearch item={item} />
            </div>
          );
        })}
      </div>
    );
  };
}
let mapStateToProps = st => {
  return {
    items: st.displayedItems
  };
};
let DisplayedItems = connect(mapStateToProps)(UnconnecteDisplayedItems);
export default DisplayedItems;

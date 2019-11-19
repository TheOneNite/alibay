import { connect } from "react-redux";
import React, { Component } from "react";
import ItemSearch from "./ItemSearch.jsx";

class UnconnecteDisplayedItems extends Component {
  constructor(props) {
    super(props);
    this.state = { allItems: [], displayItems: [] };
  }
  componentDidMount() {
    let fetchAll = async () => {
      let data = new FormData();
      data.append("search", undefined);
      let response = await fetch("/items", {
        method: "POST",
        body: data
      });
      let body = await response.text();
      let allItems = JSON.parse(body);
      console.log("/items response, ", allItems);
      this.setState({ ...this.state, allItems });
      console.log("allItems, ", this.state.allItems);
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
      <div>
        {this.state.displayItems.map(item => {
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

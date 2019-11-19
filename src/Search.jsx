import { connect } from "react-redux";
import React, { Component } from "react";

class UnconnectedSearch extends Component {
  constructor(props) {
    super(props);
    this.state = { query: "" };
  }
  handleQuery = evt => {
    this.setState({ query: evt.target.value });
  };
  submitHandler = evt => {
    evt.preventDefault();
    console.log("submitting search");
    this.props.dispatch({ type: "searchQuery", search: this.state.query });
  };
  render = () => {
    return (
      <form onSubmit={this.submitHandler}>
        Search
        <input
          type="text"
          onChange={this.handleQuery}
          value={this.state.query}
        />
      </form>
    );
  };
}

let mapStateToProps = st => {
  return {
    allItems: st.allItems
  };
};
let Search = connect(mapStateToProps)(UnconnectedSearch);
export default Search;

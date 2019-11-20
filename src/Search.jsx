import { connect } from "react-redux";
import React, { Component } from "react";
import styled from "styled-components";

const SearchWrapper = styled.div`
  width: 90vw;
  padding: 5px;
  display: flex;
  justify-self: space-around;
  justify-content: space-around;
  .search-input {
    background-color: inherit;
    width: 100%;
    font-size: 24px;
    font-variant: small-caps;
    padding: 10px;
    border: 2px solid grey;
    border-radius: 7px;
  }
  .search-input:focus {
    background-color: whitesmoke;
  }
  .search-form {
    width: 90%;
  }
`;

class UnconnectedSearch extends Component {
  constructor(props) {
    super(props);
    this.state = { query: "" };
  }
  handleQuery = evt => {
    this.setState({ query: evt.target.value });
    this.props.dispatch({ type: "searchQuery", search: this.state.query });
  };
  submitHandler = evt => {
    evt.preventDefault();
    console.log("submitting search");
    this.props.dispatch({ type: "searchQuery", search: this.state.query });
  };
  render = () => {
    return (
      <SearchWrapper>
        <form onSubmit={this.submitHandler} className="search-form">
          <input
            type="text"
            placeholder="Search"
            className="search-input"
            onChange={this.handleQuery}
            value={this.state.query}
          />
        </form>
      </SearchWrapper>
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

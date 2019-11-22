import React, { Component } from "react";
import { connect } from "react-redux";
import styled from "styled-components";

const Main = styled.div`
  background-color: inherit;
`;

class UnconnectedReviewForm extends Component {
  constructor(props) {
    super(props);
    this.state = { active: false };
  }
  inputHandler = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  submitHandler = async event => {
    event.preventDefault();
    let data = new FormData();
    data.append("title", this.state.title);
    data.append("reviewTxt", this.state.review);
    data.append("seller", this.props.sellerId);
    data.append("item", this.props.itemId);
    data.append("order", this.props.orderId);
    const res = await fetch("/review", {
      method: "POST",
      credentials: "include",
      body: data
    });
    let bod = await res.text();
    bod = JSON.parse(bod);
    if (bod.success) {
      console.log("getting updated orders");
      let ores = await fetch("/orders", {
        method: "GET",
        credentials: "include"
      });
      let obod = await ores.text();
      obod = JSON.parse(obod);
      this.props.dispatch({ type: "orders", orders: obod });
      this.props.refresh();
      return;
    } else {
      alert("Review Submission Failed");
    }
  };
  toggleActive = event => {
    this.setState({ active: !this.state.active });
  };
  render = () => {
    if (this.state.active) {
      return (
        <Main>
          <form onSubmit={this.submitHandler}>
            <input
              type="text"
              placeholder="Review Title"
              name="title"
              value={this.state.title}
              onChange={this.inputHandler}
              className="input-base"
            />
            <input
              type="textarea"
              placeholder="Your Review"
              name="review"
              value={this.state.review}
              onChange={this.inputHandler}
              className="input-multi"
            />
            <input type="submit" className="button-base" />
          </form>
        </Main>
      );
    }
    return (
      <button className="button=base" onClick={this.toggleActive}>
        Add a Review
      </button>
    );
  };
}

const ReviewForm = connect()(UnconnectedReviewForm);

export default ReviewForm;

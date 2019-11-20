import React, { Component } from "react";
//import { formatDistance } from "date-fns";
import styled from "styled-components";
import formatMoney from "./formatMoney";
import { Link } from "react-router-dom";

const OrderItemStyles = styled.li`
  box-shadow: ${props => props.theme.bs};
  list-style: none;
  padding: 2rem;
  border: 1px solid ${props => props.theme.offWhite};
  h2 {
    border-bottom: 2px solid red;
    margin-top: 0;
    margin-bottom: 2rem;
    padding-bottom: 2rem;
  }

  .images {
    display: grid;
    grid-gap: 10px;
    grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
    margin-top: 1rem;
    img {
      height: 200px;
      object-fit: cover;
      width: 100%;
    }
  }
  .order-meta {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(20px, 1fr));
    display: grid;
    grid-gap: 1rem;
    text-align: center;
    & > * {
      margin: 0;
      background: rgba(0, 0, 0, 0.03);
      padding: 1rem 0;
    }
    strong {
      display: block;
      margin-bottom: 1rem;
    }
  }
`;

const OrderUl = styled.ul`
  display: grid;
  grid-gap: 4rem;
  grid-template-columns: repeat(auto-fit, minmax(40%, 1fr));
`;

class PastOrders extends Component {
  constructor(props) {
    super(props);
    this.state = { orders: [] };
  }

  componentDidMount() {
    let fetchAll = async () => {
      let response = await fetch("/orders", {
        method: "GET"
      });
      let body = await response.text();
      let returnedOrders = JSON.parse(body);
      //console.log("returnedOrders", returnedOrders);
      this.setState({ ...this.state, orders: returnedOrders });
      return;
    };
    fetchAll();
  }

  render() {
    let orders = this.state.orders;

    // console.log("orders in render", orders);

    return (
      <div>
        <h2>You have {orders.length} completed orders</h2>
        <OrderUl>
          {orders.map(order => (
            <OrderItemStyles key={order.orderId}>
              <Link to={"/orders/" + order.orderId}>
                <div className="order-meta">
                  <p>{order.items.length} Items</p>
                  {/* <p>{formatDistance(order.createdAt, new Date())}</p> */}
                  <p>Order Total: {formatMoney(order.total)}</p>
                </div>
                <div className="images">
                  {order.items.map(item => (
                    <img key={item.id} src={item.smallImage} alt={item.title} />
                  ))}
                </div>
              </Link>
            </OrderItemStyles>
          ))}
        </OrderUl>
      </div>
    );
  }
}

export default PastOrders;

import React, { Component } from "react";
import formatMoney from "./formatMoney";
import styled from "styled-components";

const OrderStyles = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  border: 1px solid ${props => props.theme.offWhite};
  box-shadow: ${props => props.theme.bs};
  padding: 2rem;
  border-top: 10px solid red;
  & > p {
    display: grid;
    grid-template-columns: 1fr 5fr;
    margin: 0;
    border-bottom: 1px solid ${props => props.theme.offWhite};
    span {
      padding: 1rem;
      &:first-child {
        font-weight: 900;
        text-align: right;
      }
    }
  }
  .order-item {
    border-bottom: 1px solid ${props => props.theme.offWhite};
    display: grid;
    grid-template-columns: 300px 1fr;
    align-items: center;
    grid-gap: 2rem;
    margin: 2rem 0;
    padding-bottom: 2rem;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
`;

class Order extends Component {
  //orderId = routerData.match.params.orderId
  render() {
    return (
      <div>Order:{this.props.orderId}</div>
      // <OrderStyles>
      //   <p>
      //     <span>Order ID:</span>
      //     <span>{this.props.id}</span>
      //   </p>
      //   <p>
      //     <span>Charge</span>
      //     <span>{order.charge}</span>
      //   </p>
      //   <p>
      //     <span>Oate</span>
      //     <span>{format(order.createdAt, "MMMM d, YYYY h:mm a")}</span>
      //   </p>
      //   <p>
      //     <span>Order Total</span>
      //     <span>{formatMoney(order.total)}</span>
      //   </p>
      //   <p>
      //     <span>Item Count</span>
      //     <span>{order.items.length}</span>
      //     <div className="items">
      //       {order.items.map(item => (
      //         <div className="order-item" key={item.id}>
      //           <img src={item.image} alt={item.title} />
      //           <div className="item-details">
      //             <h2>{item.title}</h2>
      //             <p>Qty: {item.quantity}</p>
      //             <p>Each: {formatMoney(item.price)}</p>
      //             <p>SubTotal: {formatMoney(item.price * item.quantity)}</p>
      //             <p>{item.description}</p>
      //           </div>
      //         </div>
      //       ))}
      //     </div>
      //   </p>
      // </OrderStyles>
    );
  }
}
export default Order;

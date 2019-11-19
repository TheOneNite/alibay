import React, { Component } from 'react'; 
import { BrowserRouter, Route, Link } from "react-router-dom";

class MyAccount extends Component {  
    constructor(){
        super()
        this.state={
            username:"",
            password: "",
            address:"",
            payment:"",
            order:[]
        }
}
componentDidMount = async()=>{
//fetch the userinfo from database
    let  response = await fetch('/account') 
    let body = await response.text() 
    let userInfo = JSON.parse(body) 
    this.setState({username: userInfo.username,address: userInfo.location,
        payment:userInfo.paymentMethods,orders:userInfo.orders})
}
onChangeUsername=(event)=>{
    this.setState({username:event.target.value})
}
onChangePassword=(event)=>{
    this.setState({password:event.target.value})
}
onChangePayment=(event)=>{
    this.setState({payment:event.target.value})
}
onChangeAddress=(event)=>{
    this.setState({address:event.target.value})
}
submitHandler = evt => { 
  evt.preventDefault() 
  let data = new FormData() 
  data.append("username", this.state.username) 
  data.append("password", this.state.password)
  data.append("address", this.state.address) 
  data.append("payment", this.state.payment) 
  fetch('/account', { method: "POST", body: data }) 
}

renderOrders =()=>{}
    
renderSecurity =()=>{
    return (<form onSubmit={this.submitHandler}> 
        username: <input type="text" value={this.state.username} onChange={this.onChangeUsername} /> 
        password: <input type="text" value={this.state.password} onChange={this.onChangePassword} /> 
        <input type="submit" value="update" />
    </form>)
    
}
renderAddress =()=>{
    return (<form onSubmit={this.submitHandler}> 
        address: <input type="text" value={this.state.address} onChange={this.onChangeAddress} /> 
        <input type="submit" value="update" />
    </form>)
    
}
renderPayment =()=>{  
    return (<form onSubmit={this.submitHandler}> 
        payment: <input type="text" value={this.state.payment} onChange={this.onChangePayment} /> 
        <input type="submit" value="update" />
    </form>)  
}

render() { 
    
    return (
      <div> 
        <Link to={"/account/orders"}>my past orders</Link>
        <Link to={"/account/login"}> login&security </Link>
        <Link to={"/account/address"}>my address</Link>
        <Link to={"/account/payment"}>payment method</Link>

        <Route exact={true} path="/account/orders" render={this.renderOrders} />
        <Route exact={true} path="/account/login" render={this.renderSecurity} /> 
        <Route exact={true} path="/account/address" render={this.renderAddress} /> 
        <Route exact={true} path="/account/Payment" render={this.renderPayment} /> 
      </div>
   ) 
  } 
} 
export default MyAccount; 
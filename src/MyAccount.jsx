import React, { Component } from 'react'; 
import { BrowserRouter, Route, Link } from "react-router-dom";

class MyAccount extends Component {  
    constructor(){
        super()
        this.state={
            username:"",
            oldPassword: "",
            newPassword:"",
            address:"",
            payment:[],
            order:[]
        }
}
componentDidMount = async()=>{
//fetch the userinfo from database
    let  response = await fetch('/account') 
    let body = await response.text() 
    let userInfo = JSON.parse(body) 
    console.log("userInfo", userInfo)
    this.setState({username: userInfo.username,address: userInfo.location,
        payment:userInfo.paymentMethods,orders:userInfo.orders})
}
onChangeUsername=(event)=>{
    this.setState({username:event.target.value})
}
onChangeNewPassword=(event)=>{
    this.setState({newPassword:event.target.value})
}
onChangeOldPassword=(event)=>{
    this.setState({oldPassword:event.target.value})
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


render() { 
    
    return (
      <div> 
        <form onSubmit={this.submitSecurity}>
        <h2> login&security </h2>
        username: <input type="text" value={this.state.username} onChange={this.onChangeUsername} /> 
        old password: <input type="text" value={this.state.oldPassword} onChange={this.onChangeOldPassword} />
        new password: <input type="text" value={this.state.newPassword} onChange={this.onChangeNewPassword} />  
        </form>
        <form onSubmit={this.submitHandler}>
        <h2>my address</h2>
        address: <input type="text" value={this.state.address} onChange={this.onChangeAddress} /> 
        <h2>payment method</h2>
        payment: <input type="text" value={this.state.payment} onChange={this.onChangePayment} /> 
        <div><input type="submit" value="update" /></div>
        </form>  
      </div>
   ) 
  } 
} 
export default MyAccount; 
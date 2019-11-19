import React, { Component } from 'react'; 
import { BrowserRouter, Route, Link } from "react-router-dom";
import { join } from 'path';

class MyAccount extends Component {  
    constructor(){
        super()
        this.state={
            username:"",
            oldPassword: "",
            newPassword:"",
            address:"",
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
onChangeAddress=(event)=>{
    this.setState({address:event.target.value})
}
submitHandler = evt => { 
  evt.preventDefault() 
  let data = new FormData() 
  data.append("username", this.state.username) 
  data.append("password", this.state.password)
  data.append("address", this.state.address) 
  fetch('/account', { method: "POST", body: data }) 
}
submitUsername =async (evt) => { 
    console.log('update username')
    evt.preventDefault() 
    let data = new FormData() 
    data.append("usernameUpdate", true) 
    data.append('newUsername', this.state.username)
    let response= await fetch('/account', { method: "POST", body: data }) 
    let body = await response.text()
    let parse= JSON.parse(body)
    if(parse.success){
        window.alert('your username has been updated')
    }
    else{
        window.alert('something went wrong')
    }
  }
submitSecurity = async (evt) =>{
    console.log("update password")
    evt.preventDefault()
    let data = new FormData() 
    data.append("passwordUpdate", true) 
    data.append('oldPassword', this.state.oldPassword)
    data.append('newPassword', this.state.newPassword)
    let response= await fetch('/account', { method: "POST", body: data }) 
    let body = await response.text()
    let parse= JSON.parse(body)
    if(parse.success){
        window.alert('your username has been updated')
    }
    else{
        window.alert('something went wrong')
    }
}
submitAddress = async (evt) => { 
    console.log("update address")
    evt.preventDefault() 
    let data = new FormData() 
    data.append("usernameAddress", true) 
    data.append('newAddress', this.state.address)
    let response= await fetch('/account', { method: "POST", body: data }) 
    let body = await response.text()
    let parse= JSON.parse(body)
    if(parse.success){
        window.alert('your username has been updated')
    }
    else{
        window.alert('something went wrong')
    }
  }

render() { 
    
    return (
      <div> 
        <h2> login&security </h2>
        <form onSubmit={this.submitUsername}>
        username: <input type="text" value={this.state.username} onChange={this.onChangeUsername} /> 
        <input type="submit" value="update" />
        </form>
        <form onSubmit={this.submitUsername}>
        old password: <input type="text" value={this.state.oldPassword} onChange={this.onChangeOldPassword} />
        new password: <input type="text" value={this.state.newPassword} onChange={this.onChangeNewPassword} />  
        <input type="submit" value="update" />
        </form>
        <form onSubmit={this.submitAddress}>
        <h2>my address</h2>
        address: <input type="text" value={this.state.address} onChange={this.onChangeAddress} />  
        <input type="submit" value="update" />
        </form>  
      </div>
   ) 
  } 
} 
export default MyAccount; 
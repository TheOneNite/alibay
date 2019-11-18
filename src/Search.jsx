import { connect } from 'react-redux' 
import React, { Component } from 'react' 
class UnconnectedSearch extends Component { 
    handleQuery =async evt => { 
        let search =  evt.target.value 
        let response = await fetch('/search?search=' + encodeURIComponent(search)) 
        let body = await response.text() 
        let searchResult = JSON.parse(body)
        this.props.dispatch({type: "displayItems", items:searchResult})     
    } 
    render = () => { 
        return ( 
                <div> 
                    Search  
                    <input type="text" onChange={this.handleQuery} value={this.props.query} /> 
                </div> ) 
    } 
} 
let Search = connect()(UnconnectedSearch) 
export default Search 
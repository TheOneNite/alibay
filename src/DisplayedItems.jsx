import { connect } from 'react-redux' 
import React, { Component } from 'react' 
class UnconnecteDisplayedItems extends Component { 
fetchAll=async()=>{
    let response = await fetch('/items')
    let body = await response.text() 
    let items = JSON.parse(body)
    this.props.dispatch({type: "displayItems", items:items}) 
}

    render = () => { 
        
        if (items==undefined){
            this.fetchAll()
        }
        return (<div> 
            {this.props.items.map(item=> { 
                //display items
            return (<div>{item}</div>) 
            })} 
        </div>) 
    } 
} 
let mapStateToProps = st => { 
    return { 
        items: st.displayedItems
    } 
} 
let DisplayedItems = connect(mapStateToProps)(UnconnecteDisplayedItems) 
export default DisplayedItems
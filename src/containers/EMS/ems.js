import React from 'react';
//import logo from './logo.svg';
import '../../App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";
import Beds from './beds';
import RingDown from './ringDown';

class EMS extends React.Component {
  //UI for EMS
  constructor(props) {
    super(props);
    this.state = {
      beds: true,
      ringDown: false
    }
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(){
    this.setState({
      beds:!this.state.beds,
      ringDown: !this.state.ringDown
    })
  }

  render(){
    return (
      
        <div className="container">
        
            <div className={this.state.beds ?  "bedTab" : "bedTabSelected"}  >
            <a  className="beds" onClick={this.handleClick}>Beds</a>
            </div>
            <div className={this.state.ringDown ? "ringDownTab" : "ringDownTabselected"} >
            <a className="ringDown" onClick={this.handleClick}>Ring Down</a>
           
            </div>
            {this.state.beds && <Beds />}
            {this.state.ringDown && <RingDown />}

         
        </div>
      
  );}
}

export default EMS;
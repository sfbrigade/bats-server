import React from 'react';
//import logo from './logo.svg';
import './App.css';
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
      click: true
    }
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(){
    this.setState({
      button:!this.state.button
    })
  }

  render(){
    return (
      <Router>

        <div className="container">
          <nav>
            {/* in the process of changing the styling for the beds and ringDown links 
                className={this.state.click ? "clickTruebeds": "clickFalse"} 
                className={this.state.click ? "clickTruering": "clickFalse"}
            */}
            <Link  className="beds" onClick={this.ChangeBackground} to="/beds">Beds</Link>
            <Link className="ringDown" to="/ringDown">Ring Down</Link>
            
          </nav>

          {/* A <Switch> looks through its children <Route>s and
              renders the first one that matches the current URL. */}
          <Switch>
            <Route path="/beds">
              <Beds />
            </Route>
            <Route path="/ringDown">
              <RingDown />
            </Route>
          </Switch>
        </div>
      </Router>
  );}
}

export default EMS;
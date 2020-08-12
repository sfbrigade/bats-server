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
import EMS from './containers/EMS/ems';
import ER from './containers/ER/er';

class App extends React.Component {
  //Entry point
  
  render(){
    return (
      <Router>

        <div className="container">
          <nav> 
            <Link className="emsLink" onClick={this.handleClick} to="/ems">EMS</Link>
            <Link  onClick={this.handleClick} to="/er">ER</Link>           
          </nav>

          {/* A <Switch> looks through its children <Route>s and
              renders the first one that matches the current URL. */}
          <Switch>
            <Route path="/ems">
              <EMS />
            </Route>
            <Route path="/er">
              <ER />
            </Route>
          </Switch>
        </div>
      </Router>
  );}
}

export default App;
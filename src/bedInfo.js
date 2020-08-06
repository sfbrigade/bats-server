import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";

class BedInfo extends React.Component {
  // Bed Info will take in props from beds component and display
    render(){
        return (
            <div className='bedComponentContainer'>
            <p>On diversion&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>NO</strong></p>
            <p>ER beds&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>4</strong>&nbsp;&nbsp;&nbsp;&nbsp;15:24 7/20/2020</p>
            <p>PES beds&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>2</strong>&nbsp;&nbsp;&nbsp;&nbsp; 15:24 7/20/2020</p>
          <br/>
            <p>Rigs enroute&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>3</strong></p>
            <p>Rigs waiting&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>2</strong></p>
            <br/>
            </div>
           
        );
    }
}

export default BedInfo;
import React from 'react';
import '../../App.css';
import '../../nav.css';
import Beds from './beds';
import RingDown from './ringDown';

class EMS extends React.Component {
  //UI for EMS
  constructor(props) {
    super(props);
    this.state = {
      beds: true,
      ringDown: false,
      unitId: '',
      patientId: '',
      history: {},
    };
    this.handleClick = this.handleClick.bind(this);
    this.saveHistory = this.saveHistory.bind(this);
  }

  handleClick() {
    this.setState({
      beds: !this.state.beds,
      ringDown: !this.state.ringDown,
    });
  }

  saveHistory(state) {
    let histroy;
    this.setState({
      history: state,
    });
    console.log(this.state.history);
    return histroy;
  }

  render() {
    return (
      <div className="emsContainer">
        <div className="nav">
          <h2>EMS-SFFD</h2>
          <div className={this.state.beds ? 'bedTabSelected' : 'bedTab'}>
            <a className="beds" onClick={this.handleClick}>
              Beds
            </a>
          </div>
          <div
            className={
              this.state.ringDown ? 'ringDownTabselected' : 'ringDownTab'
            }
          >
            <a className="ringDown" onClick={this.handleClick}>
              Ring Down
            </a>
          </div>
        </div>
        {this.state.beds && <Beds />}
        {this.state.ringDown && (
          <RingDown
            history={this.state.history}
            saveHistory={this.saveHistory}
          />
        )}
      </div>
    );
  }
}

export default EMS;

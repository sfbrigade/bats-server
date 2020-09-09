import React from 'react';
import '../../ringDown.css';

class RingDown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      saved: false,
      saveTime: '',
      patientId: '',
      unit: '',
      age: '',
      gender: '',
      complaint: '',
      pulse: '',
      respiratory: '',
      spo2: '',
      temp: '',
    };
    this.handleUnitChange = this.handleChange.bind(this, 'unit');
    this.handlePatientChange = this.handleChange.bind(this, 'patientId');
    this.handleAgeChange = this.handleChange.bind(this, 'age');
    this.handleGenderSelection = this.handleChange.bind(this, 'gender');
    this.handleComplaintChange = this.handleChange.bind(this, 'complaint');
    this.handleBPChange = this.handleChange.bind(this, 'bp');
    this.handlePulseChange = this.handleChange.bind(this, 'pulse');
    this.handleRespiratoryChange = this.handleChange.bind(this, 'respiratory');
    this.handleSPO2Change = this.handleChange.bind(this, 'spo2');
    this.handleTempChange = this.handleChange.bind(this, 'temp');

    this.saved = this.saved.bind(this);
    this.creatHistory = this.creatHistory.bind(this);
    this.edit = this.edit.bind(this);
  }
  handleChange(keyName, event) {
    this.setState({
      [keyName]: event.target.value,
    });
  }
  saved() {
    const dateObj = new Date();
    this.state.saved = true;
    this.state.saveTime = dateObj.getTime();
    this.props.saveHistory(this.state);
  }
  creatHistory() {
    console.log('state', this.state);
  }
  edit() {
    this.setState({
      saved: false,
    });
  }
  componentDidMount() {
    console.log('counting and mounting', this.props.history);
    if (this.props.history !== {}) {
      this.state = this.props.history;
    }
  }

  render() {
    return (
      // <div>
      //     <h1>RINGDOWN FORM</h1>
      //     <form>
      //         <input type="text"></input>
      //         <input type="text"></input>
      //         <input type="text"></input>
      //         <input type="text"></input>

      //     </form>
      // </div>
      <div className="ringDownContainer">
        <h1 className="title">RINGDOWN FORM</h1>
        <div className="RingDownInfo">
          <h3 className="title">Identification</h3>

          {!this.state.saved ? (
            <label>
              {' '}
              Unit #{' '}
              <input
                id="unit"
                value={this.state.unit}
                onChange={this.handleUnitChange}
                type="text"
              ></input>
            </label>
          ) : (
            <div>
              <p> Unit #</p> <p>{this.state.unit}</p>
            </div>
          )}
          {!this.state.saved ? (
            <label id="patientLabel">
              {' '}
              Patient Id{' '}
              <input
                id="patientId"
                value={this.state.patientId}
                onChange={this.handlePatientChange}
                type="text"
              ></input>
            </label>
          ) : (
            <div>
              <p> Patient Id</p> <p>{this.state.patientId}</p>
            </div>
          )}
        </div>
        <div className="RingDownInfo infoAge">
          <h3 className="title">Age</h3>
          {!this.state.saved ? (
            <label id="ageLabel">
              {' '}
              Estimated Age{' '}
              <input
                id="age"
                size="2"
                value={this.state.age}
                onChange={this.handleAgeChange}
                type="text"
              ></input>
            </label>
          ) : (
            <div>
              <p> Estimated Age</p> <p>{this.state.age}</p>
            </div>
          )}
        </div>
        <div className="RingDownInfo">
          <h3 className="title">Sex</h3>
          {!this.state.saved ? (
            <label id="maleLabel">
              Male
              <input
                id="male"
                value="male"
                onChange={this.handleGenderSelection}
                type="radio"
              ></input>
            </label>
          ) : (
            <div>
              <p>{this.state.gender}</p>
            </div>
          )}
          {!this.state.saved ? (
            <label id="femaleLabel">
              {' '}
              Female
              <input
                id="female"
                value="female"
                onChange={this.handleGenderSelection}
                type="radio"
              ></input>
            </label>
          ) : (
            <div>
              <p>{this.state.gender}</p>
            </div>
          )}
          {!this.state.saved ? (
            <label>
              Non-Binary
              <input
                id="non-binanry"
                value="non-binary"
                onChange={this.handleGenderSelection}
                type="radio"
              ></input>
            </label>
          ) : (
            <div>
              <p>{this.state.gender}</p>
            </div>
          )}
        </div>
        <div className="RingDownInfo">
          <h3 className="title">Stability &amp; Chief Complaint</h3>
          {!this.state.saved ? (
            <label>
              {' '}
              Chief Complaint{' '}
              <input
                value={this.state.complaint}
                onChange={this.handleComplaintChange}
                type="text"
              ></input>
            </label>
          ) : (
            <div>
              <p> Chief Complaint</p> <p>{this.state.complaint}</p>
            </div>
          )}
        </div>
        <div className="RingDownInfo">
          <h3 className="title">Vitals</h3>
          {!this.state.saved ? (
            <label>
              {' '}
              Blood Pressure
              <input
                value={this.state.bp}
                onChange={this.handleBPChange}
                type="text"
              ></input>
            </label>
          ) : (
            <div>
              <p>Blood Pressure</p> <p>{this.state.bp}</p>
            </div>
          )}
          {!this.state.saved ? (
            <label>
              {' '}
              Pulse Rate
              <input
                value={this.state.pulse}
                onChange={this.handlePulseChange}
                type="text"
              ></input>
            </label>
          ) : (
            <div>
              <p>Pulse Rate</p> <p>{this.state.pulse}</p>
            </div>
          )}
          {!this.state.saved ? (
            <label>
              {' '}
              Respiratory Rate{' '}
              <input
                value={this.state.respiratory}
                onChange={this.handleRespiratoryChange}
                type="text"
              ></input>
            </label>
          ) : (
            <div>
              <p>Respiratory Rate</p> <p>{this.state.respiratory}</p>
            </div>
          )}
          {!this.state.saved ? (
            <label>
              {' '}
              SpO{' '}
              <input
                value={this.state.spo2}
                onChange={this.handleSPO2Change}
                type="text"
              ></input>
            </label>
          ) : (
            <div>
              <p> SpO</p> <p>{this.state.spo2}</p>
            </div>
          )}
          {!this.state.saved ? (
            <label>
              {' '}
              Temperature{' '}
              <input
                value={this.state.temp}
                onChange={this.handleTempChange}
                type="text"
              ></input>
            </label>
          ) : (
            <div>
              <p>Temperature</p> <p>{this.state.temp}</p>
            </div>
          )}
        </div>
        <div className="RingDownInfo">
          <h3 className="title">Special Circumstances</h3>
        </div>
        <div className="RingDownInfo">
          <h3 className="title">Send to:</h3>
        </div>
        {!this.state.saved && <button onClick={this.saved}>SAVE</button>}
        {this.state.saved && (
          <div>
            {' '}
            <p>{this.state.saveTime}</p>{' '}
            <button onClick={this.edit}>EDIT</button>
          </div>
        )}
      </div>
    );
  }
}

export default RingDown;

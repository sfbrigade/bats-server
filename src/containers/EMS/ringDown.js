import React from "react";

class RingDown extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            saved: false,
            saveTime: '',
            unit: 0,
            patientId: 0

        }
        this.handleUnitChange = this.handleChange.bind(this, "unit");
        this.handlePatientChange = this.handleChange.bind(this, "patientId");
        this.saved = this.saved.bind(this);
        this.edit = this.edit.bind(this);
    }
    handleChange(keyName, event){
        this.setState({
            [keyName]: event.target.value
        })
    }
    saved(){
        const dateObj = new Date()
        this.setState({
            saved:true,
            saveTime: dateObj.getTime(),
        })
    }
    edit(){
        this.setState({
            saved:false,
        })
    }
    render(){
        return (
            <div className="ringDownContainer">
                <h1 className="title">EMS Ringdown form</h1>
                <div className="RingDownInfo">
                    <h3 className="title">Identification</h3>
                   
                   {!this.state.saved ? <label> Unit # <input value={this.state.unit} onChange={this.handleUnitChange} type="text"></input></label> : <div><p> Unit #</p> <p>{this.state.unit}</p></div> }
                   {!this.state.saved ? <label> Patient Id <input value={this.state.patientId} onChange={this.handlePatientChange} type="text"></input></label> : <div><p> Patient Id</p> <p>{this.state.patientId}</p></div> }
                </div>
                <div className="RingDownInfo">
                    <h3 className="title">Age</h3>
                </div>
                <div className="RingDownInfo">
                    <h3 className="title">Sex</h3>
                </div>
                <div className="RingDownInfo">
                    <h3 className="title">Stability &amp; Chief Complaint</h3>
                </div>
                <div className="RingDownInfo">
                    <h3 className="title">Vitals</h3>
                </div>
                <div className="RingDownInfo">
                    <h3 className="title">Special Circumstances</h3>
                </div>
                <div className="RingDownInfo">
                    <h3 className="title">Send to:</h3>
                </div>
                {!this.state.saved && <button onClick={this.saved}>SAVE</button>}
                {this.state.saved && <div> <p>{this.state.saveTime}</p>  <button onClick={this.edit}>EDIT</button></div>}
            </div>
        
        );
    }
}

export default RingDown;
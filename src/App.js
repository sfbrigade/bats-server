import React from 'react';
import EMS from './ems';
import Entry from './entry';
import ER from './er';

class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            start: true,
            ems: false,
            er: false
        }
        this.chooseEms = this.chooseEms.bind(this);
        this.chooseEr = this.chooseEr.bind(this);
    }

    chooseEms(){
        this.setState({
            start: false,
            ems: true
        })
    }

    chooseEr(){
        this.setState({
            start: false,
            er: true
        })
    }

    render (){
        return(
            <div>
                {this.state.start && <Entry chooseEms={this.chooseEms} chooseEr={this.chooseEr}/>}
                {this.state.ems && <EMS />}
                {this.state.er && <ER />}
            
            </div>
        )
    }

}

export default App;
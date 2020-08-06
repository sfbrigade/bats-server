import React from 'react';

class Entry extends React.Component {
    //entry point for site
    render(){
        return(
            <div>
                <button onClick={this.props.chooseEms}>EMS</button>
                <button onClick={this.props.chooseEr}>ER</button>
            </div>
        )
    }
}

export default Entry;
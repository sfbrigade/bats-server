import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import { DateTime } from 'luxon';

import CardBody from '../Components/CardBody'
import Ringdown from '../Models/Ringdown';
import Accordian from '../Components/Accordian';

import './ER.scss';


function OffLoading({ ringdown, onChange }) {
    // constructor(props);
    // super(props);
    // this.state = {open: false};
    const state = {open: false};
    // this.togglePanel = this.togglePanel.bind(this);
    const [now, setNow] = useState(DateTime.local());
    const [togglePanel] = useState(this);


    useEffect(() => {
        const intervalId = setInterval(() => setNow(DateTime.local()), 1000);
        return () => clearInterval(intervalId);
    }, []);

    function toggle(e) {
        this.setState({open: !this.state.open})
    }

    return (
        <>
        {
            <div className="usa">   
                <h2 className="padding-bottom-2">OffLoading</h2>

                <CardBody
                    header="Incident #7753428"
                    children="Chest Pain. Mild Headache"
                    accordianTitle="Title1"
                    accordianContent="1---Random words within here"
                />
                
                {/* <div>
                    <div onClick={(e)=>toggle(e)} className='header'> words</div>
                        {state.open ? (
                        <div className='content'>
                        words
                    </div>
                    ) : null}
                </div>); */}

                <h2 className="padding-bottom-2">En Route</h2>
                <CardBody
                    header="Incident #7753428"
                    children="Chest Pain. Mild Headache"
                    accordianTitle="Title2"
                    accordianContent="2---Random words within here"
                />
                 <CardBody
                    header="Incident #8690275"
                    children="Chest Pain. Mild Headache"
                    accordianTitle="Title3"
                    accordianContent="3---Random words within here"
                />
                <CardBody
                    header="Incident #1175629"
                    children="Chest Pain. Mild Headache"
                    accordianTitle="Title3"
                    accordianContent="3---Random words within here"
                />

            </div>
        }
        </>
    );
}

OffLoading.propTypes = {
  ringdown: PropTypes.instanceOf(Ringdown).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default OffLoading;

import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import { DateTime } from 'luxon';

import CardBody from '../Components/CardBody'
import Ringdown from '../Models/Ringdown';

import './ER.scss';

function OffLoading({ ringdown, onChange }) {
    const [now, setNow] = useState(DateTime.local());
    
    useEffect(() => {
        const intervalId = setInterval(() => setNow(DateTime.local()), 1000);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <>
        {
            <div className="usa">   
                <h2 className="padding-bottom-2">OffLoading</h2>

                <CardBody
                    header="Incident #7753428"
                    children="Chest Pain. Mild Headache"
                    accordianTitle="More Info"
                    accordianContent="1---Random words within here"
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

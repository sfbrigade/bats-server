import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import { DateTime } from 'luxon';

import CardBody from '../Components/CardBody'
import Ringdown from '../Models/Ringdown';

import './ER.scss';

function EnRoute({ ringdown, onChange }) {
    const [now, setNow] = useState(DateTime.local());

    useEffect(() => {
        const intervalId = setInterval(() => setNow(DateTime.local()), 1000);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <>
        {
            <div className="usa">   

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

EnRoute.propTypes = {
  ringdown: PropTypes.instanceOf(Ringdown).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default EnRoute;

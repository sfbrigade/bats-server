import React from 'react';
import PropTypes from 'prop-types';
import Ringdown from '../Models/Ringdown';
import RingdownCard from './RingdownCard';
import Heading from './Heading';

function PatientSummary({ ringdown }) { 
    return (
        <>
            <Heading title="Ringdown Overview" />
            <RingdownCard key={ringdown.id} className="margin-x-3 margin-y-2" ringdown={ringdown} />
        </>
    )
}

PatientSummary.propTypes = {
    ringdown: PropTypes.instanceOf(Ringdown).isRequired
};
export default PatientSummary;
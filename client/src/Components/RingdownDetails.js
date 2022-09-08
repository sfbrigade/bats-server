import React from 'react';
import PropTypes from 'prop-types';

import Ringdown from '../Models/Ringdown';
import { FieldRow, PatientFieldRow, RingdownTable, Section } from './RingdownDetailsTable';

import './RingdownDetails.scss';

const toSentenceCase = (value) => (typeof value === 'string' ? value[0] + value.slice(1).toLowerCase() : value);

function RingdownDetails({ className, ringdown }) {
  return (
    <RingdownTable ringdown={ringdown} className={className}>
      <Section title="Incident info">
        <FieldRow label="Unit #" property="ambulanceIdentifier" />
        <FieldRow label="Incident #" property="dispatchCallNumber" />
        <PatientFieldRow property="emergencyServiceResponseType" renderValue={toSentenceCase} />
      </Section>
      <Section title="Patient info">
        <PatientFieldRow property="age" />
        <PatientFieldRow property="sex" renderValue={toSentenceCase} />
        <PatientFieldRow property="chiefComplaintDescription" />
        <PatientFieldRow property="stableIndicator" renderValue={(value) => (value ? 'Stable' : 'Unstable')} />
      </Section>
      <Section title="Vitals" visible={ringdown.hasVitals}>
        {(ringdown.systolicBloodPressure || ringdown.diastolicBloodPressure) && (
          <FieldRow property="systolicBloodPressure" label="BP" renderValue={(value) => `${value} / ${ringdown.diastolicBloodPressure}`} />
        )}
        <PatientFieldRow property="heartRateBpm" />
        <PatientFieldRow property="respiratoryRate" />
        <PatientFieldRow
          property="oxygenSaturation"
          renderValue={(value) => {
            const { lowOxygenResponseType: type, supplementalOxygenAmount: amount } = ringdown;
            let response = '';

            if (type === 'ROOM AIR') {
              response = '(Gave room air)';
            } else if (type === 'SUPPLEMENTAL OXYGEN') {
              response = (
                <>
                  (Gave {amount && <>{amount} L</>} O<sub>2</sub>)
                </>
              );
            }

            return (
              <>
                {value}% {response}
              </>
            );
          }}
        />
        <PatientFieldRow property="temperature" renderValue={(value) => `${value}°F`} />
      </Section>
      <Section title="Additional notes" visible={ringdown.hasAdditionalNotes}>
        <PatientFieldRow property="treatmentNotes" />
        <PatientFieldRow property="etohSuspectedIndicator" renderValue="Suspected" />
        <PatientFieldRow property="drugsSuspectedIndicator" renderValue="Suspected" />
        <PatientFieldRow property="psychIndicator" renderValue="Yes" />
        <PatientFieldRow
          property="combativeBehaviorIndicator"
          renderValue={(value) => (value && 'Yes') + (ringdown.restraintIndicator ? ', restrained' : '')}
        />
        <PatientFieldRow property="covid19SuspectedIndicator" renderValue="Suspected" />
        <PatientFieldRow property="glasgowComaScale" />
        <PatientFieldRow property="otherObservationNotes" />
      </Section>
    </RingdownTable>
  );
}

RingdownDetails.propTypes = {
  className: PropTypes.string,
  ringdown: PropTypes.instanceOf(Ringdown).isRequired,
};

RingdownDetails.defaultProps = {
  className: null,
};

export default RingdownDetails;

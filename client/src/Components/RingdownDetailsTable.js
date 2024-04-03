// in PatientFieldRow below, it's cleaner not to destructure props, since we're OR-ing the same fields from different objects
/* eslint-disable react/destructuring-assignment */
import React, { useContext, createContext } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { patient } from 'shared/metadata';
import MassCasualtyIncident from '../Models/MassCasualtyIncident';
import Ringdown from '../Models/Ringdown';
import { isValueEmpty } from '../utils';

const PatientFields = patient.getFieldHash();

const RingdownContext = createContext(undefined);

function useRingdown() {
  const context = useContext(RingdownContext);

  if (!context) {
    throw new Error('useRingdown() must be used within a RingdownTable.');
  }

  return context;
}

export function RingdownTable({ ringdown, className, children }) {
  return (
    <RingdownContext.Provider value={ringdown}>
      <div className={classNames('ringdown-details', className)}>
        <table className="usa-table usa-table--borderless width-full">
          <tbody>{children}</tbody>
        </table>
      </div>
    </RingdownContext.Provider>
  );
}

RingdownTable.propTypes = {
  ringdown: PropTypes.oneOfType([PropTypes.instanceOf(Ringdown), PropTypes.instanceOf(MassCasualtyIncident)]).isRequired,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  className: PropTypes.string,
};

RingdownTable.defaultProps = {
  className: null,
};

export function Section({ title, visible, children }) {
  return (
    visible && (
      <>
        <tr className="ringdown-details__header">
          <th colSpan="2">{title}</th>
        </tr>
        {children}
      </>
    )
  );
}

Section.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  visible: PropTypes.bool,
};

Section.defaultProps = {
  visible: true,
};

export function FieldRow({ label, property, unit, visible, renderValue }) {
  const ringdown = useRingdown();
  const value = ringdown[property];
  // show the row based on a boolean visible prop, if supplied, letting us forcibly hide or show the field regardless of its value.
  // otherwise, show it if the value is not empty and not false.  (false counts as not empty, but we want to hide unchecked options.)
  const showRow = visible ?? (!isValueEmpty(value) && value !== false);

  if (!showRow) {
    return null;
  }

  return (
    <tr>
      <th>{label}</th>
      <td>{typeof renderValue === 'function' ? renderValue(value, ringdown) : `${value} ${unit}`}</td>
    </tr>
  );
}

FieldRow.propTypes = {
  property: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  unit: PropTypes.string,
  visible: PropTypes.bool,
  renderValue: PropTypes.func,
};

FieldRow.defaultProps = {
  unit: '',
  visible: null,
  renderValue: null,
};

export function PatientFieldRow(props) {
  const field = PatientFields[props.property];

  // this is just a wrapper around FieldRow, so pass on all the props
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <FieldRow {...props} label={props.label || field.shortLabel || field.label} unit={props.unit || field.unit} />;
}

PatientFieldRow.propTypes = {
  // use the props from FieldRow, but make label optional, since we normally get it from the patient metadata
  ...FieldRow.propTypes,
  label: PropTypes.string,
};

PatientFieldRow.defaultProps = {
  ...FieldRow.defaultProps,
  label: null,
};

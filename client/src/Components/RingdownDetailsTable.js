// in PatientFieldRow below, it's cleaner not to destructure props, since we're OR-ing the same fields from different objects
/* eslint-disable react/destructuring-assignment */
import React, { useContext, createContext } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { isValueEmpty } from '../utils';
import Ringdown from '../Models/Ringdown';
import { patient } from '../shared/metadata';

const PatientFields = patient.getFieldHash();

const RingdownContext = createContext(undefined);

const useRingdown = () => {
  const context = useContext(RingdownContext);

  if (!context) {
    throw new Error('useRingdown() must be used within a RingdownTable.');
  }

  return context;
};

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
  ringdown: PropTypes.instanceOf(Ringdown).isRequired,
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

export function FieldRow({ label, property, unit, renderValue }) {
  const ringdown = useRingdown();
  let value = ringdown[property];

  // isValueEmpty treats an explicit boolean false as non-empty, but we want to hide unchecked options
  if (value === false || isValueEmpty(value)) {
    return null;
  }

  if (typeof renderValue === 'function') {
    value = renderValue(value);
  } else if (typeof renderValue === 'string') {
    value = value && renderValue;
  } else {
    value = `${value} ${unit}`;
  }

  return (
    <tr>
      <th>{label}</th>
      <td>{value}</td>
    </tr>
  );
}

FieldRow.propTypes = {
  property: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  unit: PropTypes.string,
  renderValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
};

FieldRow.defaultProps = {
  unit: '',
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

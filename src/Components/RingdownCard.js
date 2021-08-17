import React, { useState } from 'react';
import classNames from 'classnames';
import { DateTime } from 'luxon';
import PropTypes from 'prop-types';

import Card from './Card';
import Drawer from './Drawer';
import Ringdown from '../Models/Ringdown';
import RingdownDetails from './RingdownDetails';
import RingdownEta from './RingdownEta';
import Alert from './Alert';
import './RingdownCard.scss';

function RingdownCard({ className, ringdown, onStatusChange }) {
  const [isExpanded, setExpanded] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [showRedirect, setShowRedirect] = useState(false);
  const [currentHospital] = useState(ringdown.hospital.id);

  function handleCancel() {
    setShowCancel(false);
    onStatusChange(ringdown, Ringdown.Status.CANCEL_ACKNOWLEDGED);
  }

  function handleRedirect() {
    setShowRedirect(false);
    onStatusChange(ringdown, Ringdown.Status.REDIRECT_ACKNOWLEDGED);
  }

  return (
    <Card
      className={classNames(
        'ringdown-card',
        { 'ringdown-card--offloaded': ringdown.currentDeliveryStatus === Ringdown.Status.OFFLOADED },
        { 'ringdown-card--cancelled': ringdown.currentDeliveryStatus === Ringdown.Status.CANCELLED },
        {
          'ringdown-card--cancelled':
            ringdown.currentDeliveryStatus === Ringdown.Status.REDIRECTED &&
            ringdown.hospital.id &&
            ringdown.hospital.id === currentHospital,
        },
        className
      )}
      header={
        isExpanded && ringdown.currentDeliveryStatus !== Ringdown.Status.OFFLOADED ? null : `Incident #${ringdown.dispatchCallNumber}`
      }
      body={isExpanded && ringdown.currentDeliveryStatus !== Ringdown.Status.OFFLOADED ? null : ringdown.chiefComplaintDescription}
    >
      {ringdown.currentDeliveryStatus === Ringdown.Status.CANCELLED && (
        <span className="ringdown-eta ringdown-card__eta">
          <span className="ringdown-eta__prefix">Cancelled: </span>
          {DateTime.fromISO(ringdown.timestamps[Ringdown.Status.CANCELLED]).toLocaleString(DateTime.TIME_24_WITH_SECONDS)}
          <button className="usa-button usa-button--secondary width-full margin-top-4" type="button" onClick={() => setShowCancel(true)}>
            Dismiss
          </button>
        </span>
      )}
      {ringdown.currentDeliveryStatus === Ringdown.Status.REDIRECTED && ringdown.hospital.id && ringdown.hospital.id === currentHospital && (
        <span className="ringdown-eta ringdown-card__eta">
          <span className="ringdown-eta__prefix">Redirected: </span>
          {DateTime.fromISO(ringdown.timestamps[Ringdown.Status.REDIRECTED]).toLocaleString(DateTime.TIME_24_WITH_SECONDS)}
          <button className="usa-button usa-button--secondary width-full margin-top-4" type="button" onClick={() => setShowRedirect(true)}>
            Dismiss
          </button>
        </span>
      )}
      {ringdown.currentDeliveryStatus === Ringdown.Status.OFFLOADED && (
        <span className="ringdown-eta ringdown-card__eta">
          <span className="ringdown-eta__prefix">Offloaded: </span>
          {DateTime.fromISO(ringdown.timestamps[Ringdown.Status.OFFLOADED]).toLocaleString(DateTime.TIME_24_WITH_SECONDS)}
        </span>
      )}
      {ringdown.currentDeliveryStatus !== Ringdown.Status.OFFLOADED &&
        ringdown.currentDeliveryStatus !== Ringdown.Status.CANCELLED &&
        (ringdown.currentDeliveryStatus !== Ringdown.Status.REDIRECTED ||
          !ringdown.hospital.id ||
          ringdown.hospital.id !== currentHospital) && (
          <Drawer
            title={<RingdownEta className="ringdown-card__eta" ringdown={ringdown} />}
            isOpened={isExpanded}
            onToggle={() => setExpanded(!isExpanded)}
          >
            <RingdownDetails ringdown={ringdown} />
          </Drawer>
        )}
      {showCancel && (
        <Alert
          type="warning"
          title="Dismiss Notice"
          message="The Ringdown will be removed from the docket."
          cancel="Keep"
          destructive="Dismiss"
          onDestructive={handleCancel}
          onCancel={() => setShowCancel(false)}
        />
      )}
      {showRedirect && (
        <Alert
          type="warning"
          title="Dismiss Notice"
          message="The Ringdown will be removed from the docket."
          cancel="Keep"
          destructive="Dismiss"
          onDestructive={handleRedirect}
          onCancel={() => setShowRedirect(false)}
        />
      )}
    </Card>
  );
}

RingdownCard.propTypes = {
  className: PropTypes.string,
  ringdown: PropTypes.instanceOf(Ringdown).isRequired,
  onStatusChange: PropTypes.instanceOf(Function),
};

RingdownCard.defaultProps = {
  className: null,
  onStatusChange: null,
};

export default RingdownCard;

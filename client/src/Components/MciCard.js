import { useState } from 'react';
import classNames from 'classnames';
import { DateTime } from 'luxon';

import { ReactComponent as MciFilledIcon } from '../assets/img/icon-mci-filled.svg';

import Drawer from './Drawer';
import { FieldRow, RingdownTable, Section } from './RingdownDetailsTable';

import './MciCard.scss';

function MciCard({ className, data }) {
  const [isExpanded, setExpanded] = useState(false);

  return (
    <div className={classNames('mci-card', className)}>
      <Drawer
        title={
          <div className="mci-card__number">
            <MciFilledIcon />
            <div>
              MCI #{data.incidentNumber} <span>started at</span> {DateTime.fromISO(data.startedAt).toLocaleString(DateTime.TIME_SIMPLE)}
            </div>
          </div>
        }
        isOpened={isExpanded}
        onToggle={() => setExpanded(!isExpanded)}
      >
        <RingdownTable ringdown={data}>
          {data.hasAddress && (
            <Section title="Location">
              <FieldRow label="Address" property="address" />
            </Section>
          )}
          <Section title="Estimated Patient Count">
            <FieldRow label={<span className="mci-card__label mci-card__label--immediate">Immediate</span>} property="estimatedRedCount" />
            <FieldRow label={<span className="mci-card__label mci-card__label--delayed">Delayed</span>} property="estimatedYellowCount" />
            <FieldRow label={<span className="mci-card__label mci-card__label--minor">Minor</span>} property="estimatedGreenCount" />
            <FieldRow label={<span className="mci-card__label mci-card__label--dead">Dead</span>} property="estimatedZebraCount" />
            <FieldRow label={<span className="mci-card__label mci-card__label--total">Total</span>} property="estimatedPatientCount" />
            <FieldRow
              label="Updated at"
              property="updatedAt"
              renderValue={(value) => DateTime.fromISO(value).toLocaleString(DateTime.DATETIME_SHORT)}
            />
          </Section>
        </RingdownTable>
      </Drawer>
    </div>
  );
}

export default MciCard;

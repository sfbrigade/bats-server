import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { DateTime } from 'luxon';

import FormInput from '../../Components/FormInput';
import FormError from '../../Models/FormError';
import ApiService from '../../ApiService';

function MciForm() {
  const navigate = useNavigate();
  const { mciId } = useParams();
  const [data, setData] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    if (mciId && mciId !== 'new') {
      ApiService.mcis.get(mciId).then((response) => {
        const data = { ...response.data };
        // process timestamps for datetime-local input
        if (data.startedAt) {
          data.startedAt = DateTime.fromISO(data.startedAt).toISO({ suppressMilliseconds: true, includeOffset: false });
        }
        if (data.endedAt) {
          data.endedAt = DateTime.fromISO(data.endedAt).toISO({ suppressMilliseconds: true, includeOffset: false });
        }
        // don't modify estimated counts
        delete data.estimatedRedCount;
        delete data.estimatedYellowCount;
        delete data.estimatedGreenCount;
        delete data.estimatedZebraCount;
        setData(data);
      });
    } else {
      const now = DateTime.now().toISO({ includeOffset: false });
      const data = {
        incidentNumber: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        startedAt: now.substring(0, now.lastIndexOf(':')),
        endedAt: '',
      };
      setData(data);
    }
  }, [mciId]);

  function onChange(property, value) {
    const newData = { ...data };
    newData[property] = value;
    setData(newData);
  }

  async function onSubmit(event) {
    event.preventDefault();
    try {
      setError();
      // process timestamps from datetime-local
      const newData = { ...data };
      newData.startedAt = DateTime.fromISO(newData.startedAt, { zone: 'local' }).toISO();
      if (newData.endedAt) {
        newData.endedAt = DateTime.fromISO(newData.endedAt, { zone: 'local' }).toISO();
      } else {
        newData.endedAt = null;
      }
      let id = mciId;
      if (mciId && mciId !== 'new') {
        await ApiService.mcis.update(mciId, newData);
      } else {
        const response = await ApiService.mcis.create(newData);
        ({ id } = response.data);
      }
      navigate(`/admin/mcis/${id}`);
    } catch (err) {
      setError(new FormError(err));
      window.scrollTo(0, 0);
    }
  }

  return (
    <main>
      <h1>MCI</h1>
      {data && (
        <form onSubmit={onSubmit} className="usa-form">
          <div className="grid-row">
            <div className="tablet:grid-col-6">
              {error && (
                <div className="usa-alert usa-alert--slim usa-alert--error">
                  <div className="usa-alert__body">
                    <p className="usa-alert__text">{error.message}</p>
                  </div>
                </div>
              )}
              <fieldset className="usa-fieldset">
                <FormInput
                  label="Incident Number"
                  onChange={onChange}
                  property="incidentNumber"
                  required
                  showRequiredHint
                  type="text"
                  value={data.incidentNumber}
                  error={error}
                />
                <FormInput
                  label="Started At"
                  onChange={onChange}
                  property="startedAt"
                  required
                  showRequiredHint
                  type="datetime-local"
                  value={data.startedAt}
                  error={error}
                />
                {mciId && mciId !== 'new' && (
                  <FormInput
                    label="Ended At"
                    onChange={onChange}
                    property="endedAt"
                    type="datetime-local"
                    value={data.endedAt}
                    error={error}
                  />
                )}
                <FormInput label="Address 1" onChange={onChange} property="address1" type="text" value={data.address1} error={error} />
                <FormInput label="Address 2" onChange={onChange} property="address2" type="text" value={data.address2} error={error} />
                <button className="usa-button margin-y-3" type="submit">
                  Submit
                </button>
              </fieldset>
            </div>
          </div>
        </form>
      )}
    </main>
  );
}
MciForm.propTypes = {
  mciId: PropTypes.string,
};
MciForm.defaultProps = {
  mciId: undefined,
};
export default MciForm;

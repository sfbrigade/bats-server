import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import FormInput from '../../../Components/FormInput';
import FormError from '../../../Models/FormError';
import ApiService from '../../../ApiService';

function ClientForm() {
  const navigate = useNavigate();
  const { clientId } = useParams();
  const [data, setData] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    if (clientId && clientId !== 'new') {
      ApiService.clients.get(clientId).then((response) => setData(response.data));
    } else {
      const data = {
        name: '',
        redirectUri: '',
        UserEmail: '',
      };
      setData(data);
    }
  }, [clientId]);

  function onChange(property, value) {
    const newData = { ...data };
    newData[property] = value;
    setData(newData);
  }

  async function onSubmit(event) {
    event.preventDefault();
    try {
      setError();
      let info;
      if (clientId && clientId !== 'new') {
        await ApiService.clients.update(clientId, data);
        info = 'Client updated!';
      } else {
        await ApiService.clients.create(data);
        info = 'Client created!';
      }
      navigate(`/admin/site/organizations`, { state: { flash: { info } } });
    } catch (err) {
      setError(new FormError(err));
      window.scrollTo(0, 0);
    }
  }

  return (
    <main>
      <h1>Client</h1>
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
                  label="Name"
                  onChange={onChange}
                  property="name"
                  required
                  showRequiredHint
                  type="text"
                  value={data.name}
                  error={error}
                />
                <FormInput
                  label="Redirect URI"
                  onChange={onChange}
                  property="redirectUri"
                  type="text"
                  value={data.redirectUri ?? ''}
                  error={error}
                />
                <FormInput
                  label="Service Account User Email"
                  onChange={onChange}
                  property="UserEmail"
                  type="text"
                  value={data.UserEmail ?? ''}
                  error={error}
                />
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

export default ClientForm;

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Alert from '../../../Components/Alert';
import FormInput from '../../../Components/FormInput';

import FormError from '../../../Models/FormError';
import ApiService from '../../../ApiService';

function ClientForm() {
  const navigate = useNavigate();
  const { clientId } = useParams();

  const [isEnabled, setEnabled] = useState(true);
  const [data, setData] = useState();
  const [error, setError] = useState();

  const [showConfirmCreate, setShowConfirmCreate] = useState(false);
  const [showConfirmRegenerate, setShowConfirmRegenerate] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

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
    setEnabled(false);
    try {
      setError();
      if (clientId && clientId !== 'new') {
        await ApiService.clients.update(clientId, data);
        navigate(`/admin/site/clients`, { state: { flash: { info: 'Client updated!' } } });
      } else {
        const response = await ApiService.clients.create(data);
        setData(response.data);
        setShowConfirmCreate(true);
      }
    } catch (err) {
      setEnabled(true);
      setError(new FormError(err));
      window.scrollTo(0, 0);
    }
  }

  function onConfirmCreate() {
    if (clientId === 'new') {
      navigate(`/admin/site/clients`, { state: { flash: { info: 'Client created!' } } });
    } else {
      setShowConfirmCreate(false);
    }
  }

  async function onDelete() {
    try {
      await ApiService.clients.delete(clientId);
      navigate(`/admin/site/clients`, { state: { flash: { info: 'Client deleted!' } } });
    } catch (err) {
      setError(new FormError(err));
      window.scrollTo(0, 0);
    }
  }

  async function onRegenerate() {
    setShowConfirmRegenerate(false);
    setEnabled(false);
    try {
      const response = await ApiService.clients.regenerate(clientId);
      setData(response.data);
      setShowConfirmCreate(true);
    } catch (err) {
      setError(new FormError(err));
      window.scrollTo(0, 0);
    }
    setEnabled(true);
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
              <fieldset disabled={!isEnabled} className="usa-fieldset">
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
                {!!data.id && (
                  <div className="display-flex margin-top-4">
                    <div className="flex-1 margin-right-1">
                      <FormInput
                        label="Client ID"
                        property="clientId"
                        disabled
                        readOnly
                        type="text"
                        value={data.clientId ?? ''}
                        error={error}
                      />
                    </div>
                    <button type="button" className="usa-button usa-button--outline" onClick={() => setShowConfirmRegenerate(true)}>
                      Regenerate
                    </button>
                  </div>
                )}
                <div className="display-flex flex-justify">
                  <button className="usa-button margin-y-3" type="submit">
                    Submit
                  </button>
                  {!!clientId && clientId !== 'new' && (
                    <button
                      className="usa-button usa-button--secondary margin-y-3 margin-x-0"
                      type="button"
                      onClick={() => setShowConfirmDelete(true)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </fieldset>
            </div>
          </div>
        </form>
      )}
      {showConfirmCreate && (
        <Alert title="Client credentials" type="info" primary="OK" onPrimary={() => onConfirmCreate()}>
          <p>Please record the following, they will not be displayed again.</p>
          <p>
            <b>Client ID:</b> {data.clientId}
            <br />
            <b>Client secret:</b> {data.clientSecret}
          </p>
        </Alert>
      )}
      {showConfirmRegenerate && (
        <Alert
          title="Are you sure?"
          type="warning"
          message="Are you sure you wish to regenerate client credentials? This cannot be undone."
          destructive="Yes"
          onDestructive={onRegenerate}
          cancel="No"
          onCancel={() => setShowConfirmRegenerate(false)}
        />
      )}
      {showConfirmDelete && (
        <Alert
          title="Are you sure?"
          type="error"
          message="Are you sure you wish to delete this client?"
          destructive="Yes"
          onDestructive={onDelete}
          cancel="No"
          onCancel={() => setShowConfirmDelete(false)}
        />
      )}
    </main>
  );
}

export default ClientForm;

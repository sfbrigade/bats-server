import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import ApiService from '../ApiService';
import FormError from '../Models/FormError';
import FormInput from '../Components/FormInput';
import Spinner from '../Components/Spinner';

function Invite() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [invite, setInvite] = useState();
  const [data, setData] = useState();
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    if (id) {
      ApiService.invites.get(id).then((response) => {
        const { data } = response;
        setInvite(data);
        setData({
          firstName: data.firstName ?? '',
          lastName: data.lastName ?? '',
          email: data.email ?? '',
          password: '',
        });
      });
    }
  }, [id]);

  function onChange(property, value) {
    const newData = { ...data };
    newData[property] = value;
    setData(newData);
  }

  async function onSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError();
    try {
      await ApiService.invites.accept(id, data);
      navigate('/login', { state: { flash: { success: 'Account created! You may log in using your email and password.' } } });
    } catch (err) {
      setLoading(false);
      setError(new FormError(err));
      window.scrollTo(0, 0);
    }
  }

  return (
    <div className="grid-container">
      <div className="grid-row">
        <div className="grid-col-10 grid-offset-1 tablet:grid-col-6 tablet:grid-offset-3 desktop:grid-col-4 desktop:grid-offset-4">
          <div className="margin-top-6 margin-bottom-8">
            <div className="text-center">
              <Link to="/">
                <h1 className="hospital-dest-title">
                  <img src="/img/logomark-300.png" className="logo" alt="Routed logo" />
                </h1>
              </Link>
              {!invite && <Spinner />}
              {invite?.revokedAt && <h4 className="text-base">This invite is no longer available.</h4>}
              {invite?.acceptedAt && <h4 className="text-base">This invite has already been accepted.</h4>}
            </div>
            {invite && !invite.revokedAt && !invite.acceptedAt && (
              <>
                <h4 className="text-base text-center">
                  To accept this invite, please
                  <br />
                  sign up for an account below.
                </h4>
                {error && (
                  <div className="usa-alert usa-alert--slim usa-alert--error">
                    <div className="usa-alert__body">
                      <p className="usa-alert__text">{error.message}</p>
                    </div>
                  </div>
                )}
                <form className="usa-form" onSubmit={onSubmit}>
                  <fieldset className="usa-fieldset" disabled={isLoading}>
                    <FormInput
                      label="First Name"
                      onChange={onChange}
                      property="firstName"
                      required
                      showRequiredHint
                      type="text"
                      value={data.firstName}
                      error={error}
                    />
                    <FormInput
                      label="Last Name"
                      onChange={onChange}
                      property="lastName"
                      required
                      showRequiredHint
                      type="text"
                      value={data.lastName}
                      error={error}
                    />
                    <FormInput
                      label="Email"
                      onChange={onChange}
                      property="email"
                      required
                      showRequiredHint
                      type="email"
                      value={data.email}
                      error={error}
                    />
                    <FormInput
                      label="Password"
                      onChange={onChange}
                      property="password"
                      required
                      showRequiredHint
                      type="password"
                      value={data.password}
                      error={error}
                    />
                    <button type="submit" className="usa-button width-full">
                      Submit
                    </button>
                  </fieldset>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Invite;

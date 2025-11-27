import Heading from '../Components/Heading';
import Spinner from '../Components/Spinner';
import CallCard from '../Components/CallCard';
import './Consult.scss';

export default function Consult({ agora }) {
  async function onLogin() {
    await agora.login();
  }

  function onDismiss(call) {
    agora.setMessages((prevMessages) => prevMessages.filter((prevMessage) => prevMessage.id !== call.id));
  }

  function onAnswer(call) {
    window.open(`/call?channel=${call.userId}`, '_blank');
  }

  return (
    <div className="usa-accordion consult">
      <div className="usa-accordion__content">
        <Heading title="Status" />
        <fieldset className="usa-fieldset">
          {!(agora?.isInitialized ?? false) && (
            <>
              <Spinner />
            </>
          )}
          {agora?.isInitialized && (
            <>
              {!(agora?.isLoggedIn ?? false) && (
                <>
                  <div className="usa-alert usa-alert--error">
                    <div className="usa-alert__body">
                      <h3 className="usa-alert__heading">Offline</h3>
                      <p className="usa-alert__text">Not receiving calls.</p>
                    </div>
                  </div>
                  <ul className="usa-button-group flex-column flex-align-stretch">
                    <li className="usa-button-group__item">
                      <button type="button" className="usa-button width-full" onClick={onLogin}>
                        Set Status Online
                      </button>
                    </li>
                  </ul>
                </>
              )}
              {agora?.isLoggedIn && (
                <>
                  <div className="usa-alert usa-alert--success">
                    <div className="usa-alert__body">
                      <h3 className="usa-alert__heading">Online</h3>
                      <p className="usa-alert__text">Receiving calls.</p>
                    </div>
                  </div>
                  <ul className="usa-button-group flex-column flex-align-stretch">
                    <li className="usa-button-group__item">
                      <button type="button" className="usa-button usa-button--outline usa-button--secondary width-full" onClick={onLogin}>
                        Set Status Offline
                      </button>
                    </li>
                  </ul>
                </>
              )}
            </>
          )}
        </fieldset>
        {agora?.isLoggedIn && (
          <>
            <Heading title="Incoming Calls" />
            <div>
              {agora?.messages.map((message) => (
                <CallCard className="margin-x-3 margin-y-2" key={message.id} call={message} onAnswer={onAnswer} onDismiss={onDismiss} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState, Fragment } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import ApiService from '../ApiService';
import Header from '../Components/Header';

function Events() {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState();
  const [selectedEvent, setSelectedEvent] = useState();

  useEffect(() => {
    ApiService.peak.events.index().then((response) => {
      setEvents(response.data);
    });
  }, []);

  useEffect(() => {
    if (selectedEventId) {
      ApiService.peak.events.get(selectedEventId).then((response) => {
        setSelectedEvent(response.data);
      });
    }
  }, [selectedEventId]);

  function toggleEvent(eventId) {
    if (selectedEventId === eventId) {
      setSelectedEventId();
    } else {
      setSelectedEvent();
      setSelectedEventId(eventId);
    }
  }

  return (
    <div className="grid-container">
      <div className="grid-row">
        <div className="tablet:grid-col-6 tablet:grid-offset-3">
          <Header name="Routed" />
          <div>
            <table className="usa-table usa-table--striped usa-table--borderless usa-table--hoverable width-full">
              <tbody>
                {events.map((event) => (
                  <Fragment key={event.id}>
                    <tr onClick={() => toggleEvent(event.id)}>
                      <td>
                        <h3>
                          <i className={classNames('fas', selectedEventId === event.id ? 'fa-caret-down' : 'fa-caret-right')} />
                          &nbsp;{event.name}
                        </h3>
                      </td>
                      <td>
                        <Link className="usa-button width-full" to={`/ems?venueId=${event.venueId}`}>
                          EMS
                        </Link>
                      </td>
                    </tr>
                    {selectedEventId === event.id &&
                      selectedEvent?.venue?.facilities?.map((facility) => (
                        <tr key={facility.id}>
                          <td>
                            <h3 className="padding-left-5">{facility.name}</h3>
                          </td>
                          <td>
                            <Link className="usa-button width-full" to={`/er?hospitalId=${facility.id}`}>
                              Clinic
                            </Link>
                          </td>
                        </tr>
                      ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Events;

import React from 'react';
import PropTypes from 'prop-types';

import Heading from '../../Components/Heading';

import './ErRingdownsTable.scss';

export default function ErRingdownsTable({ more }) {
  return (
    <div className="margin-y-5">
      <span>
        <button type="button" className="bg-white border-0 border-bottom margin-x-2">
          Today
        </button>
        <button type="button" className="bg-white border-0 border-bottom margin-x-2">
          This Week
        </button>
        <button type="button" className="bg-white border-0 border-bottom margin-x-2">
          This Month
        </button>
        <input type="date" />
      </span>
      <Heading title="Ringdown History" />

      <table cellSpacing="0" cellPadding="0">
        <tr>
          <th className="padding-2">
            Time
            <div className="shift">
              <button type="button" className="bg-white border-0">
                &lt;
              </button>
              <button type="button" className="bg-white border-0">
                &gt;
              </button>
            </div>
          </th>
          <th className="padding-2">
            Ambulance #
            <div className="shift">
              <button type="button" className="bg-white border-0">
                &lt;
              </button>
              <button type="button" className="bg-white border-0">
                &gt;
              </button>
            </div>
          </th>
          <th className="padding-2">
            Incident #
            <div className="shift">
              <button type="button" className="bg-white border-0">
                &lt;
              </button>
              <button type="button" className="bg-white border-0">
                &gt;
              </button>
            </div>
          </th>
          <th className="padding-2">Show details</th>
        </tr>
        <tr>
          <td className="padding-2 row-border">5:30 am</td>
          <td className="padding-2 row-border">9876</td>
          <td className="padding-2 row-border">38654</td>
          <td className="padding-2 row-border">
            <button type="button" className="bg-white border-0" onClick={() => more()}>
              !
            </button>
          </td>
        </tr>
        <tr>
          <td className="padding-2 row-border">7:30 pm</td>
          <td className="padding-2 row-border">4563</td>
          <td className="padding-2 row-border">48867</td>
          <td className="padding-2 row-border">
            <button type="button" className="bg-white border-0" onClick={() => more()}>
              !
            </button>
          </td>
        </tr>
        <tr>
          <td className="padding-2 row-border">8:30 am</td>
          <td className="padding-2 row-border">3957</td>
          <td className="padding-2 row-border">48375</td>
          <td className="padding-2 row-border">
            <button type="button" className="bg-white border-0" onClick={() => more()}>
              !
            </button>
          </td>
        </tr>
      </table>
    </div>
  );
}
ErRingdownsTable.propTypes = {
  more: PropTypes.func.isRequired,
};

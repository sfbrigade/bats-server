import React from 'react';

const time = '09:57:25';
const medic = 'Medic 16';
const MajorComplaint = 'Chest pain. Mild headach';

const PatientInfo = () => {
  return (
    <div>
      <div className="display-table width-full">
        <div className="display-table-row height-10">
          <div className="display-table-cell ...">
            {medic}
            <p>{MajorComplaint}</p>
          </div>
        </div>
        <div className="display-table-row height-5">
          <div className="display-table-cell ...">
            ETA: {time} <button className="usa-button--unstyled">More info</button>
          </div>
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default PatientInfo;

const MoreInfo = () => {
  return <div>Hello</div>;
};

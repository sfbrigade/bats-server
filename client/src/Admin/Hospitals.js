import React, { useContext} from 'react';
import Context from '../Context';

function Hospitals() {
  const { organization} = useContext(Context);

  return (
    <>
      {organization.type === "HEALTHCARE" &&
        <main>
          <div>
            <h1>Hospitals</h1>
            {organization.hospitals.map(hospital => <div>{hospital.name}</div>)}
          </div>
        </main>
      }
    </>
  );
}

export default Hospitals;

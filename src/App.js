import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import ApiService from './ApiService';
import Context from './Context';
import EMS from './EMS';
import ER from './ER';
import Redirect from './Components/Redirect';

function App() {
  const { setUser } = useContext(Context);

  useEffect(() => {
    // hit the users endpoint to ensure authenticated
    ApiService.users.me().then((response) => {
      // save the user data into the context
      setUser(response.data);
    });
  }, [setUser]);

  return (
    <Router>
      <Switch>
        <Route path="/ems">
          <EMS />
        </Route>
        <Route path="/er">
          <ER />
        </Route>
        <Route exact path="/">
          <Redirect />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;

import React from 'react';

import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import EMS from './EMS';
import ER from './ER';

export default function App() {
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
          <Redirect to="/ems" />
        </Route>
      </Switch>
    </Router>
  );
}

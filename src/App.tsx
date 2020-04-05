import React from 'react';
import './App.scss';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { TreePage } from './components/TreePage/TreePage';
import { ActivityPage } from './components/ActivityPage/ActivityPage';
import { RoomPage } from './components/RoomPage/RoomPage';
import { GroupReflectionPage } from './components/Reflection/GroupReflectionPage';

export const APP = function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/" component={TreePage} />
          <Route exact path="/activities/:tenet" component={ActivityPage} />
          <Route exact path="/room" component={RoomPage} />
          <Route exact path="/room/:id" component={RoomPage} />
          <Route exact path="/test-group-reflection" component={GroupReflectionPage} />
        </Switch>
      </div>
    </Router>
  );
};

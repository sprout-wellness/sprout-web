import React from 'react';
import './App.scss';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { TreePage } from './components/TreePage/TreePage';
import { ActivityPage } from './components/ActivityPage/ActivityPage';
import { RoomPage } from './components/RoomPage/RoomPage';

export const APP = function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/room" component={RoomPage} />
          <Route path="/activities">
            <ActivityPage />
          </Route>
          <Route path="/">
            <TreePage />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

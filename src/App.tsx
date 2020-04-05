import React from 'react';
import './App.scss';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { TreePage } from './components/TreePage/TreePage';
import { ActivityPage } from './components/ActivityPage/ActivityPage';
import { RoomPage } from './components/RoomPage/RoomPage';
import { ReflectionPage } from './components/Reflection/ReflectionPage';
import { RoomReflectionPage } from './components/Reflection/RoomReflectionPage';

export const APP = function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/" component={TreePage} />
          <Route exact path="/activities/:tenet" component={ActivityPage} />
          <Route exact path="/room/:id" component={RoomPage} />
          <Route exact path="/test-reflection" component={ReflectionPage} />
          <Route exact path="/test-room-reflection" component={RoomReflectionPage} />
        </Switch>
      </div>
    </Router>
  );
};

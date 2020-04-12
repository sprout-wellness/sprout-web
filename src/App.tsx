import React from 'react';
import './App.scss';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { TreePage } from './components/TreePage/TreePage';
import { ActivityPage } from './components/ActivityPage/ActivityPage';
import { RoomPage } from './components/RoomPage/RoomPage';
import { ReflectionPage } from './components/RoomPage/ReflectionPage';
import { RoomReflectionPage } from './components/RoomPage/RoomReflectionPage';
import { NotFoundPage } from './components/NotFoundPage/NotFoundPage';
import { AuthPage } from './components/AuthPage/AuthPage';

export const APP = function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/signup" component={AuthPage} />
          <Route exact path="/" component={TreePage} />
          <Route exact path="/activities/:tenet" component={ActivityPage} />
          <Route exact path="/room/:id" component={RoomPage} />
          <Route exact path="/test-reflection" component={ReflectionPage} />
          <Route
            exact
            path="/test-room-reflection"
            component={RoomReflectionPage}
          />
          <Route component={NotFoundPage} />
        </Switch>
      </div>
    </Router>
  );
};

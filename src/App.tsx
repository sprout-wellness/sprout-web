import React from 'react';
import './App.scss';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { TreePage } from './components/TreePage/TreePage';
import { ActivityPage } from './components/ActivityPage/ActivityPage';
import { RoomPage } from './components/RoomPage/RoomPage';
import { ReflectionPage } from './components/ReflectionPage/ReflectionPage';
import { NotFoundPage } from './components/NotFoundPage/NotFoundPage';
import { NavBar } from './components/NavBar/NavBar';

export const APP = function App() {
  return (
    <Router>
      <div>
        <NavBar />
        <Switch>
          <Route exact path="/" component={TreePage} />
          <Route exact path="/activities/:tenet" component={ActivityPage} />
          <Route exact path="/room/:id" component={RoomPage} />
          <Route exact path="/room/:id/reflection" component={ReflectionPage} />
          <Route component={NotFoundPage} />
        </Switch>
      </div>
    </Router>
  );
};

import React from 'react';
import './App.scss';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { TreePage } from './components/TreePage/TreePage';
import { ActivityPage } from './components/ActivityPage/ActivityPage';
import { RoomPage } from './components/RoomPage/RoomPage';
import { ReflectionPage } from './components/ReflectionPage/ReflectionPage';
import { NotFoundPage } from './components/NotFoundPage/NotFoundPage';
import { NavBar } from './components/NavBar/NavBar';
import { SignInPage } from './components/SignInPage/SignInPage';
import { UserProvider } from './providers/UserProvider';
import { ProfilePage } from './components/ProfilePage/ProfilePage';

export const APP = function App() {
  return (
    <UserProvider>
      <Router>
        <NavBar />
        <Switch>
          <Route exact path="/" component={TreePage} />
          <Route exact path="/signin" component={SignInPage} />
          <Route exact path="/profile" component={ProfilePage} />
          <Route exact path="/activities/:tenet" component={ActivityPage} />
          <Route exact path="/room/:id" component={RoomPage} />
          <Route exact path="/room/:id/reflection" component={ReflectionPage} />
          <Route component={NotFoundPage} />
        </Switch>
      </Router>
    </UserProvider>
  );
};

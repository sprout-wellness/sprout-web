import React from 'react';
import './App.scss';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { TreePage } from './components/TreePage/TreePage';
import { ActivityPage } from './components/ActivityPage/ActivityPage';
import { RoomPage } from './components/RoomPage/RoomPage';
import { ReflectionSubmissionPage } from './components/Reflection/ReflectionSubmissionPage';
import { NotFoundPage } from './components/NotFoundPage/NotFoundPage';

export const APP = function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/" component={TreePage} />
          <Route exact path="/activities/:tenet" component={ActivityPage} />
          <Route exact path="/room/:id" component={RoomPage} />

          <Route exact path="/test-reflection"
                render={(props) => <ReflectionSubmissionPage 
                          {...props}
                          userId={"asdf"}
                          roomId={"1mIMXIziHIrPrx4M5Soo"}
                          activityId={"1001"}
                        />}
              />

          <Route component={NotFoundPage} />
        </Switch>
      </div>
    </Router>
  );
};

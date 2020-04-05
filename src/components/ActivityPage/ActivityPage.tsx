import React, { Component } from 'react';
import { match } from 'react-router-dom';
import { firebase } from '../../FirebaseSetup';
import 'firebase/firestore';

interface DetailParams {
  tenet: string;
}

interface ActivityPageProps {
  match?: match<DetailParams>;
}

type Activity = {
  category: string;
  instructions: string;
  motivation: string;
  name: string;
  time: number;
};

type ActivityPageState = {
  tenet: string;
  activities: Activity[];
};

export class ActivityPage extends Component<
  ActivityPageProps,
  ActivityPageState
> {
  constructor(props: ActivityPageProps) {
    super(props);

    // Getting wellness tenet from the url.
    const match = this.props.match;
    var currentTenet: string = match
      ? match.params.tenet
      : "This wellness tenet doesn't exist!";
    this.state = {
      tenet: currentTenet,
      activities: [],
    };
  }

  componentDidMount() {
    this.fetchActivities();
  }

  fetchActivities() {
    firebase
      .firestore()
      .collection('activities')
      .where('category', '==', this.state.tenet)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc: any) => {
          this.setState((prevState: any) => {
            return {
              activities: [...prevState.activities, doc.data()],
            };
          });
        });
      });
  }

  render() {
    return (
      <div>
        <h1>{this.state.tenet}</h1>
        {this.state.activities.map((item, key) => {
          return <li key={key}>{item.name}</li>;
        })}
      </div>
    );
  }
}

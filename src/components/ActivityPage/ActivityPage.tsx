import React, { Component } from 'react';
import { match, Link } from 'react-router-dom';
import { firebase } from '../../FirebaseSetup';
import 'firebase/firestore';
import './ActivityPage.scss';

interface DetailParams {
  tenet: string;
}

interface ActivityPageProps {
  match?: match<DetailParams>;
}

interface Activity {
  id: number;
  category: string;
  instructions: string;
  motivation: string;
  name: string;
  time: number;
}

interface ActivityPageState {
  tenet: string;
  activities: Activity[];
}

export class ActivityPage extends Component<
  ActivityPageProps,
  ActivityPageState
> {
  constructor(props: ActivityPageProps) {
    super(props);

    // Getting wellness tenet from the url.
    const match = this.props.match;
    const currentTenet: string = match
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
        snapshot.forEach((doc: firebase.firestore.DocumentData) => {
          var activity: Activity = doc.data();
          activity.id = doc.id;
          this.setState((prevState: ActivityPageState) => {
            return {
              activities: [...prevState.activities, activity],
            };
          });
        });
      });
  }

  capitalizeFirstLetter(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  render() {
    return (
      <div id="activity-page">
        <h1 className="title">
          {this.capitalizeFirstLetter(this.state.tenet)}
        </h1>
        <div className="card-container">
          {this.state.activities.map((item, key) => {
            return (
              <Link
                key={key}
                to={`/room?create=` + item.id}
                style={{ textDecoration: 'none' }}
              >
                <div className="card">
                  <img
                    className="card-image"
                    src="../../images/tree.png"
                    alt=""
                  />
                  <h3 className="card-title">{item.name}</h3>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    );
  }
}

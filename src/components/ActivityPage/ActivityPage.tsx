import React, { Component } from 'react';
import { match, Redirect } from 'react-router-dom';
import { firebase } from '../../FirebaseSetup';
import 'firebase/firestore';
import './ActivityPage.scss';
import { Activity } from '../../storage/Activity';
import { Room } from '../../storage/Room';

interface DetailParams {
  tenet: string;
}

interface ActivityPageProps {
  match?: match<DetailParams>;
}

interface ActivityPageState {
  tenet: string;
  activities: Activity[];
  redirectToRoom: string;
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
      redirectToRoom: '',
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
      .then((querySnap) => {
        querySnap.forEach(
          (documentSnap: firebase.firestore.QueryDocumentSnapshot) => {
            this.setState((prevState: ActivityPageState) => {
              return {
                activities: [
                  ...prevState.activities,
                  Activity.LoadFromSnapshot(documentSnap),
                ],
              };
            });
          }
        );
      });
  }

  createRoom(activity: Activity) {
    Room.Create(activity, (room) => {
      this.setState({
        redirectToRoom: room.id,
      });
    });
  }

  capitalizeFirstLetter(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  render() {
    if (this.state.redirectToRoom) {
      return <Redirect to={`/room/${this.state.redirectToRoom}`} />;
    }
    return (
      <div id="activity-page">
        <h1 className="title">
          {this.capitalizeFirstLetter(this.state.tenet)}
        </h1>
        <div className="card-container tight">
          {this.state.activities.map((item, key) => {
            return (
              <div
                className="card"
                key={key}
                onClick={this.createRoom.bind(this, item)}
              >
                <img
                  className="card-image"
                  src="../../images/tree.png"
                  alt=""
                />
                <h3 className="card-title">{item.name}</h3>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

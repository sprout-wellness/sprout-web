import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import './RoomPage.scss';

import { firebase } from '../../FirebaseSetup';
import 'firebase/firestore';
import { parse as parseQueryParams } from 'query-string';

interface RoomPageProps {
  match: {
    params: {
      id: string;
    };
  };
  location: {
    search: string;
  };
}

interface RoomPageState {
  toRoom: string;
  id: string;
  activity?: firebase.firestore.DocumentData;
  errors: string[];
}

export class RoomPage extends Component<RoomPageProps, RoomPageState> {
  state = {
    toRoom: '',
    id: 'Creating new room...',
    activity: {
      name: 'Loading...',
    },
    errors: [] as string[],
  };

  componentDidMount() {
    const query = parseQueryParams(this.props.location.search);
    if ('create' in query && query.create && !isNaN(Number(query.create))) {
      return this.createRoom(Number(query.create));
    }
    if (this.props.match.params.id) {
      return this.loadRoom(this.props.match.params.id);
    }
    this.appendErrorMsg('Invalid request.');
  }

  appendErrorMsg(msg: string) {
    this.setState({
      errors: [...this.state.errors, msg],
    });
  }

  createRoom(activityId: number) {
    firebase
      .firestore()
      .collection('activities')
      .doc(activityId.toString())
      .get()
      .then((activitySnap) => {
        if (!activitySnap.exists) {
          this.appendErrorMsg(`Activity ${activityId} not found.`);
          return;
        }
        const roomRef = firebase.firestore().collection('rooms').doc();
        roomRef
          .set({
            activity: activitySnap.ref.path,
          })
          .then(() => {
            this.setState({
              toRoom: roomRef.id,
              errors: [],
            });
          });
      });
  }

  loadRoom(roomId: string) {
    firebase
      .firestore()
      .collection('rooms')
      .doc(roomId)
      .get()
      .then((roomSnap) => {
        if (!roomSnap.exists) {
          this.appendErrorMsg(`Room ${roomId} not found.`);
          return;
        }
        const activityId = roomSnap.data()!.activity;
        firebase
          .firestore()
          .doc(activityId)
          .get()
          .then((activitySnap) => {
            if (!activitySnap.exists) {
              this.appendErrorMsg(
                `Room ${roomId} is corrupted. Activity ${activityId} does not exist. Please create another room.`
              );
              return;
            }
            this.setState({
              id: roomSnap.id,
              activity: activitySnap.data()! as RoomPageState['activity'],
              errors: [],
            });
          });
      });
  }

  render() {
    if (this.state.errors.length) {
      return (
        <div id="room-page">
          {this.state.errors.map((errorMsg, i) => {
            return (
              <p className="error" key={i}>
                {errorMsg}
              </p>
            );
          })}
        </div>
      );
    }
    if (this.state.toRoom) {
      return <Redirect to={`/room/${this.state.toRoom}`} />;
    }
    return (
      <div id="room-page">
        <h1 className="title">Room</h1>
        <p>
          <b>Room ID</b>: {this.state.id}
        </p>
        <p>
          <b>Activity</b>: {this.state.activity!.name}
        </p>
        {/* <p><b>Attendees</b>: {this.state.activity}</p> */}
      </div>
    );
  }
}

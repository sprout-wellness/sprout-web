import React, { Component, MouseEvent } from 'react';
import './RoomPage.scss';
import { firebase } from '../../FirebaseSetup';
import 'firebase/firestore';
import copy from 'clipboard-copy';

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
  id: string;
  activity?: firebase.firestore.DocumentData;
  errors: string[];
  showTooltip: boolean;
}

export class RoomPage extends Component<RoomPageProps, RoomPageState> {
  state = {
    id: 'Creating new room...',
    activity: {
      name: 'Loading...',
      motivation: '',
      time: 0,
      category: '',
    },
    errors: [] as string[],
    showTooltip: false,
  };

  componentDidMount() {
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

  handleCopy(event: MouseEvent) {
    event.preventDefault();
    copy('sproutwellness.com/room/' + this.state.id);
    this.setState({ showTooltip: true });
    setTimeout(() => {
      this.setState({ showTooltip: false });
    }, 2000);
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
    return (
      <div id="room-page">
        <div className="activity-container" id={this.state.activity!.category}>
          <div>
            <h1 className="title">{this.state.activity!.name}</h1>
            <div className="row">
              <p>
                <b>Room link</b>: sproutwellness.com/room/{this.state.id}
              </p>
              <div>
                <button onClick={this.handleCopy.bind(this)}>
                  Copy room link
                </button>
                <span
                  className={`copy-tooltip ${
                    this.state.showTooltip ? '' : 'hidden'
                  }`}
                >
                  Copied to clipboard!
                </span>
              </div>
            </div>
          </div>
          <div className="participant-container">
            <h4>Tao Ong</h4>
          </div>
        </div>
        <p>
          <b>Duration</b>: {this.state.activity!.time} minutes
        </p>
        <p>{this.state.activity!.motivation}</p>
        {/* <p><b>Attendees</b>: {this.state.activity}</p> */}
      </div>
    );
  }
}

import React, { Component, MouseEvent } from 'react';
import './RoomPage.scss';
import { firebase } from '../../FirebaseSetup';
import 'firebase/firestore';
import copy from 'clipboard-copy';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faUser } from '@fortawesome/free-solid-svg-icons';

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
            <b>Invite others to join with this link: </b>
            <div className="room-link-row">
              <p>sproutwellness.com/room/{this.state.id}</p>
              <FontAwesomeIcon
                icon={faCopy}
                onClick={this.handleCopy.bind(this)}
              ></FontAwesomeIcon>
              <span
                className={`copy-tooltip ${
                  this.state.showTooltip ? '' : 'hidden'
                }`}
              >
                Copied to clipboard!
              </span>
            </div>
            <button className="begin-button">Begin Practice</button>
          </div>
          <div className="participants-container">
            <div className="participant-card">
              <FontAwesomeIcon icon={faUser}></FontAwesomeIcon>
              <h4 className="participant-name">Tao Ong</h4>
            </div>
            <div className="participant-card">
              <FontAwesomeIcon icon={faUser}></FontAwesomeIcon>
              <h4 className="participant-name">Orkun Duman</h4>
            </div>
            <div className="participant-card">
              <FontAwesomeIcon icon={faUser}></FontAwesomeIcon>
              <h4 className="participant-name">Carson Trinh</h4>
            </div>
            <div className="participant-card">
              <FontAwesomeIcon icon={faUser}></FontAwesomeIcon>
              <h4 className="participant-name">Mike You</h4>
            </div>
          </div>
        </div>
        <p>
          <b>Duration</b>: {this.state.activity!.time} minutes
        </p>
        <p>{this.state.activity!.motivation}</p>
      </div>
    );
  }
}

import React, { Component, MouseEvent } from 'react';
import copy from 'clipboard-copy';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faUser } from '@fortawesome/free-solid-svg-icons';
import { ReflectionPage } from '../ReflectionPage/ReflectionPage';
import { ReflectionForm } from '../ReflectionPage/ReflectionForm';
import { Room } from '../../storage/Room';
import { User } from '../../storage/User';
import { firebase } from '../../FirebaseSetup';
import './RoomPage.scss';

interface RoomPageProps {
  match: {
    params: {
      id: string;
    };
  };
}

interface RoomPageState {
  room: Room | undefined;
  errors: string[];
  showTooltip: boolean;
  currentTime: Date;
  currentUser: User | undefined;
  reflectionSubmitted: boolean;
}

export class RoomPage extends Component<RoomPageProps, RoomPageState> {
  reflectionListener: (() => void) | undefined = undefined;
  state = {
    room: undefined,
    errors: [] as string[],
    showTooltip: false,
    currentTime: new Date(),
    currentUser: undefined,
    reflectionSubmitted: false,
  };

  componentDidMount() {
    if (!this.props.match.params.id) {
      this.appendErrorMsg('Invalid request.');
    }

    // Load room and currently logged in user.
    this.loadRoom(this.props.match.params.id);
    this.loadUser('B22cmNKy21YdIh7Fga8Y');
    this.addReflectionListener(
      this.props.match.params.id,
      'B22cmNKy21YdIh7Fga8Y'
    );

    // During the practice, ticking moves along the progress bar.
    setInterval(() => this.tick(), 1000);
  }
  componentWillUnmount() {
    // Unsubscribe the reflection listener.
    const unsubscribe: () => void = this.reflectionListener!;
    unsubscribe();
  }

  loadRoom = async (roomId: string): Promise<string> => {
    Room.Load(roomId, (room?) => {
      if (!room) {
        this.appendErrorMsg(`Room ${roomId} not found.`);
        return '';
      }
      this.setState({
        room,
        errors: [],
      });
      return room.id;
    });
    return '';
  };

  loadUser = async (userId: string) => {
    const user = await User.Load(userId);
    if (!user) {
      this.appendErrorMsg(`User ${userId} not found.`);
      return;
    }
    this.setState({
      currentUser: user,
      errors: [],
    });
  };

  addReflectionListener(roomId: string, userId: string) {
    this.reflectionListener = firebase
      .firestore()
      .collection('reflections')
      .where('room', '==', roomId)
      .onSnapshot((snapshot: firebase.firestore.QuerySnapshot) => {
        snapshot
          .docChanges()
          .forEach((change: firebase.firestore.DocumentChange) => {
            if (change.type === 'added') {
              if (change.doc.data().user === userId) {
                this.setState({ reflectionSubmitted: true });
              }
            }
          });
      });
  }

  tick() {
    this.setState({
      currentTime: new Date(),
    });
  }

  secondsPassed() {
    const room: Room = this.state.room!;
    return (this.state.currentTime.getTime() - room.startTime) / 1000;
  }

  activityInSession() {
    const room: Room = this.state.room!;
    if (room.startTime === -1) {
      return false;
    }
    return this.secondsPassed() < room.activity.time * 60;
  }

  getProgressBarWidth() {
    const room: Room = this.state.room!;
    return `${Math.min(
      100,
      this.secondsPassed() / (room.activity.time * 0.6)
    )}%`;
  }

  appendErrorMsg(msg: string) {
    this.setState({
      errors: [...this.state.errors, msg],
    });
  }

  handleCopy(event: MouseEvent) {
    const room: Room = this.state.room!;
    event.preventDefault();
    copy('sprout-wellness.web.app/room/' + room.id);
    this.setState({ showTooltip: true });
    setTimeout(() => {
      this.setState({ showTooltip: false });
    }, 2000);
  }

  begin() {
    const room: Room = this.state.room!;
    Room.Begin(room.id);
    this.loadRoom(room.id);
  }

  renderError() {
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

  renderLoading() {
    return <div id="room-page">Loading...</div>;
  }

  renderLobby() {
    const room: Room = this.state.room!;
    return (
      <div id="room-page">
        <div className="activity-container" id={room.activity.category}>
          <div>
            <h1 className="title">{room.activity.name}</h1>
            <b>Invite others to join with this link: </b>
            <div className="room-link-row">
              <p>sproutwellness.com/room/{room.id}</p>
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
            <button className="begin-button" onClick={this.begin.bind(this)}>
              Begin Practice
            </button>
          </div>
          <div className="participants-container">
            <div className="participant-card">
              <FontAwesomeIcon icon={faUser}></FontAwesomeIcon>
              <h4 className="participant-name">Tao Ong</h4>
            </div>
            <div className="participant-card">
              <FontAwesomeIcon icon={faUser}></FontAwesomeIcon>
              <h4 className="participant-name">Sarah Chen</h4>
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
        <div className="activity-details">
          <p>
            <b>Duration</b>: {room.activity.time} minutes
          </p>
          <p>{room.activity.motivation}</p>
        </div>
      </div>
    );
  }

  renderActivity() {
    const room: Room = this.state.room!;
    return (
      <div id="in-session-page">
        <h1 className="activity-title">{room.activity.name}</h1>
        <p className="activity-instructions">{room.activity.instructions}</p>
        <div id="progress-bar-container">
          <div
            id="progress-bar"
            style={{
              width: this.getProgressBarWidth(),
            }}
          ></div>
        </div>
      </div>
    );
  }

  renderReflectionForm() {
    const room: Room = this.state.room!;
    const user: User = this.state.currentUser!;
    return <ReflectionForm room={room} user={user}></ReflectionForm>;
  }

  renderRoomReflectionPage() {
    const room: Room = this.state.room!;
    return <ReflectionPage roomId={room.id}></ReflectionPage>;
  }

  render() {
    const room: Room = this.state.room!;
    if (this.state.errors.length) {
      return this.renderError();
    }
    if (!room) {
      return this.renderLoading();
    }
    if (!room.startTime) {
      return this.renderLobby();
    }
    if (this.activityInSession()) {
      return this.renderActivity();
    }
    if (!this.state.reflectionSubmitted) {
      return this.renderReflectionForm();
    }
    return this.renderRoomReflectionPage();
  }
}

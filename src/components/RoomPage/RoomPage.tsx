import React, { Component, MouseEvent } from 'react';
import copy from 'clipboard-copy';
import { Redirect } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faUser } from '@fortawesome/free-solid-svg-icons';
import { Room } from '../../storage/Room';
import { User } from '../../storage/User';
import { UserContext } from '../../providers/UserProvider';
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
}

export class RoomPage extends Component<RoomPageProps, RoomPageState> {
  static contextType = UserContext;

  state = {
    room: undefined,
    errors: [] as string[],
    showTooltip: false,
    currentTime: new Date(),
  };

  componentDidMount() {
    (async () => {
      try {
        this.setState({
          room: await Room.Load(this.props.match.params.id),
        });
      } catch (e) {
        this.appendErrorMsg(e.toString());
      }
    })();

    // During the practice, ticking moves along the progress bar.
    setInterval(() => this.tick(), 1000);
  }

  tick() {
    this.setState({
      currentTime: new Date(),
    });
  }

  secondsPassed() {
    const room: Room = this.state.room!;
    return (this.state.currentTime.getTime() - room.getStartTime()) / 1000;
  }

  activityInSession() {
    const room: Room = this.state.room!;
    if (room.getStartTime() === -1) {
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

  copyToClipboard(event: MouseEvent) {
    const room: Room = this.state.room!;
    event.preventDefault();
    copy('sprout-wellness.web.app/room/' + room.id);
    this.setState({ showTooltip: true });
    setTimeout(() => {
      this.setState({ showTooltip: false });
    }, 2000);
  }

  async begin() {
    const room: Room = this.state.room!;
    await room.begin();
  }

  async join() {
    const user = this.context.user as User | null;
    if (user === null) {
      console.log("User is null, can't join room.");
      return;
    }
    const room: Room = this.state.room!;
    await room.join(user);
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
    return <div id="loading">Loading...</div>;
  }

  renderLobby(room: Room) {
    const user = this.context.user as User;
    return (
      <div id="room-page">
        {!room.userInRoom(user) && (
          <div id="invite-container">
            <button id="join-button" onClick={this.join.bind(this)}>
              Join this room!
            </button>
          </div>
        )}
        <div className="activity-container" id={room.activity.category}>
          <div>
            <h1 className="title">{room.activity.name}</h1>
            <b>Invite others to join with this link: </b>
            <div className="room-link-row">
              <p>sproutwellness.com/room/{room.id}</p>
              <FontAwesomeIcon
                id="copy-icon"
                icon={faCopy}
                onClick={this.copyToClipboard.bind(this)}
              ></FontAwesomeIcon>
              <span
                className={`copy-tooltip ${
                  this.state.showTooltip ? '' : 'hidden'
                }`}
              >
                Copied to clipboard!
              </span>
            </div>
            <button className="begin-button" onClick={() => this.begin()}>
              Begin Practice
            </button>
          </div>
          <div className="participants-container">
            {room.getAttendees().map((user, key) => {
              return (
                <div className="participant-card" key={key}>
                  {user.photoURL && (
                    <img
                      id="profile-picture"
                      src={user.photoURL}
                      alt="Profile"
                    />
                  )}
                  {!user.photoURL && (
                    <FontAwesomeIcon icon={faUser}></FontAwesomeIcon>
                  )}
                  <h4 className="participant-name">{user.displayName}</h4>
                </div>
              );
            })}
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

  renderActivity(room: Room) {
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

  render() {
    const room: Room = this.state.room!;
    if (this.state.errors.length) {
      return this.renderError();
    }
    if (!room) {
      return this.renderLoading();
    }
    if (room.getStartTime() < 0) {
      return this.renderLobby(room);
    }
    if (this.activityInSession()) {
      return this.renderActivity(room);
    }
    return <Redirect to={`/room/${room.id}/reflection`} />;
  }
}

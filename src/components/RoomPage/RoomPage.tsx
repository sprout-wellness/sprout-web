import React, { Component, MouseEvent } from 'react';
import copy from 'clipboard-copy';
import { Redirect } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faUser } from '@fortawesome/free-solid-svg-icons';
import { Room } from '../../storage/Room';
import { User } from '../../storage/User';
import { UserContext } from '../../providers/UserProvider';
import './RoomPage.scss';
import { SignInPage } from '../SignInPage/SignInPage';

interface RoomPageProps {
  match: {
    params: {
      id: string;
    };
  };
}

interface RoomPageState {
  errors: string[];
  room: Room | null;
  currentTime: Date;
  tooltipVisible: boolean;
  redirectToSignin: boolean;
}

export class RoomPage extends Component<RoomPageProps, RoomPageState> {
  static contextType = UserContext;

  state = {
    errors: [] as string[],
    room: null,
    currentTime: new Date(),
    tooltipVisible: false,
    redirectToSignin: false,
  };

  componentDidMount() {
    // Load room data async.
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
    setInterval(() => {
      this.setState({
        currentTime: new Date(),
      });
    }, 1000);
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
    this.setState({ tooltipVisible: true });
    setTimeout(() => {
      this.setState({ tooltipVisible: false });
    }, 2000);
  }

  async joinRoom() {
    const user = this.context.user as User | null;
    if (user === null) {
      this.setState({
        redirectToSignin: true,
      });
      return;
    }
    const room: Room = this.state.room!;
    await room.join(user);
  }

  async beginActivity() {
    const room: Room = this.state.room!;
    await room.begin();
  }

  getProgressBarWidth() {
    const room: Room = this.state.room!;
    const percentComplete =
      (100 * room.getActivitySecondsPassed(this.state.currentTime)) /
      (room.activity.time * 60);
    return `${percentComplete}%`;
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
    const user = this.context.user as User | null;
    const notInRoom = user === null || !room.userInRoom(user);
    return (
      <div id="room-page">
        {notInRoom && (
          <div id="invite-container">
            <button id="join-button" onClick={() => this.joinRoom()}>
              Join this room!
            </button>
          </div>
        )}
        <div className="activity-container" id={room.activity.category}>
          <div className="left-container">
            <h1 className="title">{room.activity.name}</h1>
            <b>Invite others to join with this link: </b>
            <div className="room-link-row">
              <p>sproutwellness.com/room/{room.id}</p>
              <FontAwesomeIcon
                id="copy-icon"
                icon={faCopy}
                onClick={e => this.copyToClipboard(e)}
              ></FontAwesomeIcon>
              <span
                className="copy-tooltip"
                hidden={!this.state.tooltipVisible}
              >
                Copied to clipboard!
              </span>
            </div>
            <button
              className="begin-button"
              disabled={notInRoom}
              onClick={() => this.beginActivity()}
            >
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
    if (this.state.errors.length) {
      return this.renderError();
    }
    const room = this.state.room as Room | null;
    if (room === null) {
      return this.renderLoading();
    }
    if (this.state.redirectToSignin) {
      return <SignInPage destination={`/room/${room.id}`} />;
    }
    if (!room.activityHasBegun()) {
      return this.renderLobby(room);
    }
    const user = this.context.user as User | null;
    if (user === null) {
      return <SignInPage destination={`/room/${room.id}`} />;
    }
    if (!room.userInRoom(user)) {
      return <div>The activity has already begun, without you.</div>;
    }
    if (room.activityIsInSession(this.state.currentTime)) {
      return this.renderActivity(room);
    }
    return <Redirect to={`/room/${room.id}/reflection`} />;
  }
}

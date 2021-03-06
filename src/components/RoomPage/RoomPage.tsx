import React, { Component, MouseEvent } from 'react';
import { firebase } from '../../FirebaseSetup';
import 'firebase/firestore';
import copy from 'clipboard-copy';
import { Redirect } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { Instruction } from '../../storage/Activity';
import { Room } from '../../storage/Room';
import { User } from '../../storage/User';
import { UserContext } from '../../providers/UserProvider';
import { SignInPage } from '../SignInPage/SignInPage';
import { LoadingPage } from '../LoadingPage/LoadingPage';
import { ErrorPage } from '../ErrorPage/ErrorPage';
import './RoomPage.scss';

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
  roomListener: (() => void) | undefined = undefined;
  progressBarCounter = 0;

  state = {
    errors: [] as string[],
    room: null,
    currentTime: new Date(),
    tooltipVisible: false,
    redirectToSignin: false,
  };

  componentDidMount = async () => {
    // Load room data async.
    try {
      this.setState({
        room: await Room.Load(this.props.match.params.id),
      });
    } catch (e) {
      this.appendErrorMsg(e.toString());
      return;
    }

    // Create listener for room updates.
    this.addRoomListener();

    // During the practice, ticking moves along the progress bar.
    this.progressBarCounter = window.setInterval(() => {
      this.setState({
        currentTime: new Date(),
      });
    }, 1000);
  };

  componentWillUnmount() {
    // Unsubscribe the room listener.
    if (this.roomListener) {
      const unsubscribe: () => void = this.roomListener!;
      unsubscribe();
    }
    // Stop the progress bar counter.
    clearInterval(this.progressBarCounter);
  }

  addRoomListener() {
    const room: Room = this.state.room!;
    this.roomListener = firebase
      .firestore()
      .collection('rooms')
      .doc(room.id)
      .onSnapshot(async roomSnap => {
        this.setState({ room: await Room.LoadFromData(roomSnap) });
      });
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

  getCurrentInstruction() {
    const room: Room = this.state.room!;
    const instructions: Instruction[] = room.activity.instructions;
    let secondsPassed: number = room.getActivitySecondsPassed(
      this.state.currentTime
    );
    const emptyInstruction: Instruction = {
      instruction: 'Please wait...',
      duration: 600,
    };
    for (const instruction of instructions) {
      secondsPassed -= instruction.duration;
      if (secondsPassed <= 0) {
        if (
          secondsPassed >= -2 || // Fade out with 2 seconds left.
          Math.abs(secondsPassed) + 1 >= instruction.duration // Fade in 1 second after instruction starts.
        ) {
          // The negative duration is used as a condition to animate.
          return {
            instruction: instruction.instruction,
            duration: -1,
          };
        }
        return instruction;
      }
    }
    return emptyInstruction;
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
    return <LoadingPage />;
  }

  renderLobby(room: Room) {
    const user = this.context.user as User | null;
    const notInRoom = user === null || !room.userInRoom(user);
    return (
      <div id="room-page">
        {notInRoom && (
          <div id="invite-container">
            <button
              className="button"
              id="join-button"
              onClick={() => this.joinRoom()}
            >
              Join this room!
            </button>
          </div>
        )}
        <div className="activity-container" id={room.activity.category}>
          <div className="left-container">
            <h1 className="title">{room.activity.name}</h1>
            <b>Invite others to join with this link: </b>
            <div className="room-link-row">
              <p>https://sproutwellness.com/room/{room.id}</p>
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
              className="button begin-button"
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
                  {user.photoURL ? (
                    <img
                      className="participant-picture"
                      src={user.photoURL}
                      alt="Profile"
                    />
                  ) : (
                    <FontAwesomeIcon
                      className="participant-picture"
                      icon={faUserCircle}
                    ></FontAwesomeIcon>
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
    const currentInstruction: Instruction = this.getCurrentInstruction();

    return (
      <div id="in-session-page">
        <div className="participants-container">
          {room.getAttendees().map((user, key) => {
            return (
              <div key={key}>
                {user.photoURL ? (
                  <img
                    className="participant-picture"
                    src={user.photoURL}
                    alt="Profile"
                  />
                ) : (
                  <FontAwesomeIcon
                    className="participant-picture"
                    icon={faUserCircle}
                  ></FontAwesomeIcon>
                )}
              </div>
            );
          })}
        </div>
        <p
          className={
            currentInstruction.duration !== -1
              ? 'activity-instructions active'
              : 'activity-instructions'
          }
        >
          {currentInstruction.instruction}
        </p>
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
      return (
        <ErrorPage
          title={'Invalid room ID!'}
          error={"This room has expired or doesn't exist."}
        />
      );
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
      return (
        <ErrorPage title={'Sorry!'} error={'This room has already started.'} />
      );
    }
    if (room.activityIsInSession(this.state.currentTime)) {
      return this.renderActivity(room);
    }
    return <Redirect to={`/room/${room.id}/reflection`} />;
  }
}

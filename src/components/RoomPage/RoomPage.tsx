import React, { Component, MouseEvent } from 'react';
import copy from 'clipboard-copy';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faUser } from '@fortawesome/free-solid-svg-icons';
import { Room } from '../../storage/Room';
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
}

export class RoomPage extends Component<RoomPageProps, RoomPageState> {
  state = {
    room: undefined,
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
    Room.Load(roomId, (room?) => {
      if (!room) {
        this.appendErrorMsg(`Room ${roomId} not found.`);
        return;
      }
      this.setState({
        room,
        errors: [],
      });
    });
  }

  handleCopy(event: MouseEvent) {
    const room: Room = this.state.room!;
    event.preventDefault();
    copy('sproutwellness.com/room/' + room.id);
    this.setState({ showTooltip: true });
    setTimeout(() => {
      this.setState({ showTooltip: false });
    }, 2000);
  }

  begin() {
    const room: Room = this.state.room!;
    Room.Begin(room.id);
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

  render() {
    if (this.state.errors.length) {
      return this.renderError();
    }
    if (!this.state.room) {
      return this.renderLoading();
    }
    return this.renderLobby();
  }
}

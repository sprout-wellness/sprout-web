import React, { Component } from 'react';
import './RoomPage.scss';
import { Room } from '../../storage/Room';

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
}

export class RoomPage extends Component<RoomPageProps, RoomPageState> {
  state = {
    room: undefined,
    errors: [] as string[],
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
    if (!this.state.room) {
      return <div id="room-page">Loading...</div>;
    }
    const room: Room = this.state.room!;
    return (
      <div id="room-page">
        <h1 className="title">Room</h1>
        <p>
          <b>Room ID</b>: {room.id}
        </p>
        <p>
          <b>Activity</b>: {room.activity.name}
        </p>
        {/* <p><b>Attendees</b>: {this.state.activity}</p> */}
      </div>
    );
  }
}

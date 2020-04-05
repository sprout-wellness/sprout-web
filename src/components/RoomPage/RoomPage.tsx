import React, { Component } from 'react'; // let's also import Component
import './RoomPage.scss';

import { firebase } from '../../FirebaseSetup';
import 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { parse as parseQueryParams } from 'query-string';

interface RoomPageProps {
  location: {
    search: string;
  };
}

interface RoomPageState {
  id: string;
  time: Date;
}

// Clock has no properties, but the current state is of type ClockState
// The generic parameters in the Component typing allow to pass props
// and state. Since we don't have props, we pass an empty object.
export class RoomPage extends Component<RoomPageProps, RoomPageState> {
  state = {
    id: 'Creating new room...',
    time: new Date(),
  };

  tick() {
    this.setState({
      time: new Date(),
    });
  }

  // After the component did mount, we set the state each second.
  componentDidMount() {
    const query = parseQueryParams(this.props.location.search);
    if ('create' in query) {
      console.log(query.create);
    }
    setInterval(() => this.tick(), 1000);
    const randomId = uuidv4();
    firebase
      .firestore()
      .collection('rooms')
      .add({
        id: randomId,
      });
    this.setState({
      id: randomId,
    });
  }

  // render will know everything!
  render() {
    return (
      <div className="container">
        <h1 className="title">Room</h1>
        <p>Time: {this.state.time.toLocaleTimeString()}</p>
        <p>Room ID: {this.state.id}</p>
        <p>Activity: ABC</p>
      </div>
    );
  }
}

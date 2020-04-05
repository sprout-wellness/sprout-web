import React, { Component } from "react"; // let's also import Component
import "./RoomPage.scss";

// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
import * as firebase from "firebase/app";
import "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { parse as parseQueryParams } from "query-string";

const firebaseConfig = {
  apiKey: "AIzaSyBgKAC5vrSSFfZsCxi1wpVdwk3ZbNlYuIo",
  authDomain: "sprout-wellness.firebaseapp.com",
  databaseURL: "https://sprout-wellness.firebaseio.com",
  projectId: "sprout-wellness",
  storageBucket: "sprout-wellness.appspot.com",
  messagingSenderId: "658431260118",
  appId: "1:658431260118:web:9513c73b085c8eadd22077",
  measurementId: "G-MYV1VZM8G9"
};

interface RoomPageProps {
  location: {
    search: string;
  };
}

type RoomPageState = {
  id: string;
  time: Date;
};

// Clock has no properties, but the current state is of type ClockState
// The generic parameters in the Component typing allow to pass props
// and state. Since we don't have props, we pass an empty object.
export class RoomPage extends Component<RoomPageProps, RoomPageState> {
  state = {
    id: "Creating new room...",
    time: new Date(),
  };

  tick() {
    this.setState({
      time: new Date(),
    });
  }

  // After the component did mount, we set the state each second.
  componentDidMount() {
    var query = parseQueryParams(this.props.location.search);
    if ('create' in query) {
      console.log(query.create);
    }
    setInterval(() => this.tick(), 1000);
    var random_id = uuidv4();
    firebase.initializeApp(firebaseConfig).firestore().collection('rooms').add({
      id: random_id,
    }).catch(function(error) {
      console.error('Error writing new room to database.', error);
    });
    this.setState({
      id: random_id,
    });
  }

  // render will know everything!
  render() {
    return (
      <div className="container">
        <h1 className="title">
          Room
        </h1>
        <p>Time: {this.state.time.toLocaleTimeString()}</p>
        <p>Room ID: {this.state.id}</p>
        <p>Activity: ABC</p>
      </div>
    );
  }
}

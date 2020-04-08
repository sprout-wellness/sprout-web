import React, { Component } from 'react';
import { Reflection } from '../../storage/Reflection';
import { firebase } from '../../FirebaseSetup';
import { Link } from 'react-router-dom';

interface RoomReflectionPageProps {
  roomId: string;
}

interface RoomReflectionPageState {
  reflections: Reflection[];
}

export class RoomReflectionPage extends Component<
  RoomReflectionPageProps,
  RoomReflectionPageState
> {
  reflectionListener: (() => void) | undefined = undefined;

  constructor(props: RoomReflectionPageProps) {
    super(props);
    this.state = { reflections: [] };
  }

  componentDidMount() {
    // Update state to represent all relevant reflections.
    this._fetchReflectionsAndUpdateState();
    this.addReflectionListener();
  }

  componentWillUnmount() {
    // Unsubscribe the reflection listener.
    const unsubscribe: () => void = this.reflectionListener!;
    unsubscribe();
  }

  private _fetchReflectionsAndUpdateState() {
    firebase
      .firestore()
      .collection('reflections')
      .where('room', '==', this.props.roomId)
      .get()
      .then(snapshot => {
        snapshot.forEach((doc: firebase.firestore.DocumentData) => {
          this.setState((prevState: RoomReflectionPageState) => {
            return {
              reflections: [...prevState.reflections, doc.data()],
            };
          });
        });
      });
  }

  private addReflectionListener() {
    this.reflectionListener = firebase
      .firestore()
      .collection('reflections')
      .where('roomId', '==', this.props.roomId)
      .onSnapshot((snapshot: firebase.firestore.QuerySnapshot) => {
        snapshot
          .docChanges()
          .forEach((change: firebase.firestore.DocumentData) => {
            if (change.type === 'added') {
              this.setState((prevState: RoomReflectionPageState) => {
                return {
                  reflections: [...prevState.reflections, change.doc.data()],
                };
              });
            }
          });
      });
  }

  render() {
    return (
      <div>
        <h1>Group Reflections</h1>
        {this.state.reflections.map((item, key) => {
          return <div key={key}>{item.text}</div>;
        })}
        <nav>
          <Link to="/">
            <button>Complete Practice</button>
          </Link>
        </nav>
      </div>
    );
  }
}

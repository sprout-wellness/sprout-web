import React, { Component } from 'react';
import { Reflection } from '../../storage/Reflection';
import { firebase } from '../../FirebaseSetup';
import { Link } from 'react-router-dom';

interface ReflectionPageProps {
  roomId: string;
}

interface ReflectionPageState {
  reflections: Reflection[];
}

export class ReflectionPage extends Component<
  ReflectionPageProps,
  ReflectionPageState
> {
  reflectionListener: (() => void) | undefined = undefined;

  constructor(props: ReflectionPageProps) {
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
          this.setState((prevState: ReflectionPageState) => {
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
              this.setState((prevState: ReflectionPageState) => {
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
      <div id="room-reflection-page">
        <h1 className="title">Group Reflections</h1>
        <div className="reflections-container">
          {this.state.reflections.map((item, key) => {
            return (
              <div key={key} className="reflection">
                {item.text}
              </div>
            );
          })}
        </div>
        <Link to="/">
          <button>Complete Practice</button>
        </Link>
      </div>
    );
  }
}

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
  _unsubscribe: any = undefined;

  constructor(props: RoomReflectionPageProps) {
    super(props);
    this.state = { reflections: [] };
  }

  componentDidMount() {
    // initiate API calls here. Probably load in all of the reflections for this activityID and groupID
    // feel free to call setState() here. But best to set state in constructor!

    // update state to represent all relevant reflections
    this._fetchReflectionsAndUpdateState();
    this._addReflectionDBListener();
  }

  componentWillUnmount() {
    // where you put cleanup stuff. You can't modify component state in this lifecycle!
    //this._unsubscribe();
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

  private _addReflectionDBListener() {
    this._unsubscribe = firebase
      .firestore()
      .collection('reflections')
      .where('roomId', '==', this.props.roomId)
      .onSnapshot((snapshot: firebase.firestore.QuerySnapshot) => {
        snapshot.docChanges().forEach((change: any) => {
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

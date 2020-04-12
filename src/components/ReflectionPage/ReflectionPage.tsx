import React, { Component } from 'react';
import { firebase } from '../../FirebaseSetup';
import 'firebase/firestore';
import { Link } from 'react-router-dom';
import { Reflection } from '../../storage/Reflection';
import { Room } from '../../storage/Room';
import { User } from '../../storage/User';
import { ReflectionForm } from './ReflectionForm';

interface ReflectionPageProps {
  match: {
    params: {
      id: string;
    };
  };
}

interface ReflectionPageState {
  reflections: Reflection[];
  room: Room | undefined;
  currentUser: User | undefined;
  errors: string[];
  reflectionSubmitted: boolean;
}

export class ReflectionPage extends Component<
  ReflectionPageProps,
  ReflectionPageState
> {
  reflectionListener: (() => void) | undefined = undefined;

  constructor(props: ReflectionPageProps) {
    super(props);
    this.state = {
      reflections: [],
      room: undefined,
      currentUser: undefined,
      errors: [],
      reflectionSubmitted: false,
    };
  }

  componentDidMount = async () => {
    // Load room and currently logged in user.
    await this.loadRoom(this.props.match.params.id);
    await this.loadUser('B22cmNKy21YdIh7Fga8Y');
    this.fetchUserReflection(
      this.props.match.params.id,
      'B22cmNKy21YdIh7Fga8Y'
    );

    // Update state to represent all relevant reflections.
    this.fetchReflectionsAndUpdateState();
    this.addReflectionListener();
  };

  componentWillUnmount() {
    // Unsubscribe the reflection listener.
    const unsubscribe: () => void = this.reflectionListener!;
    unsubscribe();
  }

  loadRoom = async (roomId: string) => {
    const room = await Room.Load(roomId);
    if (!room) {
      this.appendErrorMsg(`Room ${roomId} not found.`);
    }
    this.setState({
      room,
      errors: [],
    });
  };

  loadUser = async (userId: string) => {
    const user = await User.Load(userId);
    if (!user) {
      this.appendErrorMsg(`User ${userId} not found.`);
      return;
    }
    this.setState({
      currentUser: user,
      errors: [],
    });
  };

  fetchUserReflection = async (roomId: string, userId: string) => {
    const reflectionExists = await Reflection.ReflectionExists(roomId, userId);
    this.setState({ reflectionSubmitted: reflectionExists });
  };

  appendErrorMsg(msg: string) {
    this.setState({
      errors: [...this.state.errors, msg],
    });
  }

  fetchReflectionsAndUpdateState() {
    const room: Room = this.state.room!;
    firebase
      .firestore()
      .collection('reflections')
      .where('room', '==', room.id)
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

  addReflectionListener() {
    const room: Room = this.state.room!;
    const user: User = this.state.currentUser!;
    this.reflectionListener = firebase
      .firestore()
      .collection('reflections')
      .where('room', '==', room.id)
      .onSnapshot((snapshot: firebase.firestore.QuerySnapshot) => {
        snapshot
          .docChanges()
          .forEach((change: firebase.firestore.DocumentData) => {
            if (change.type === 'added') {
              if (change.doc.data().userId === user.id) {
                this.setState({ reflectionSubmitted: true });
              }
              this.setState((prevState: ReflectionPageState) => {
                return {
                  reflections: [...prevState.reflections, change.doc.data()],
                };
              });
            }
          });
      });
  }

  renderLoading() {
    return <h1 className="loading-page">LOADING</h1>;
  }

  renderReflectionForm(room: Room, user: User) {
    if (room && user) {
      return <ReflectionForm room={room} user={user}></ReflectionForm>;
    }
    return this.renderLoading();
  }

  renderReflectionPage() {
    return (
      <div id="reflection-page">
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

  render() {
    const room: Room = this.state.room!;
    const user: User = this.state.currentUser!;
    if (!room || !user) {
      return this.renderLoading();
    }
    if (!this.state.reflectionSubmitted) {
      return this.renderReflectionForm(room, user);
    }
    return this.renderReflectionPage();
  }
}

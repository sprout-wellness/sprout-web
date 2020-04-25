import React, { Component } from 'react';
import { firebase } from '../../FirebaseSetup';
import 'firebase/firestore';
import { Link } from 'react-router-dom';
import { Reflection } from '../../storage/Reflection';
import { Room } from '../../storage/Room';
import { UserContext } from '../../providers/UserProvider';
import { User } from '../../storage/User';
import { ReflectionForm } from './ReflectionForm';
import './ReflectionPage.scss';

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
  errors: string[];
  reflectionSubmitted: boolean;
}

export class ReflectionPage extends Component<
  ReflectionPageProps,
  ReflectionPageState
> {
  static contextType = UserContext;
  reflectionListener: (() => void) | undefined = undefined;

  constructor(props: ReflectionPageProps) {
    super(props);
    this.state = {
      reflections: [],
      room: undefined,
      errors: [],
      reflectionSubmitted: false,
    };
  }

  componentDidMount = async () => {
    // Load room and currently logged in user.
    await this.loadRoom(this.props.match.params.id);
    const user = this.context.user as User | null;
    if (user === null) {
      return;
    }
    this.fetchUserReflection(this.state.room!.id, user.id);

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
      .where('roomId', '==', room.id)
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
    const user = this.context.user as User | null;
    this.reflectionListener = firebase
      .firestore()
      .collection('reflections')
      .where('roomId', '==', room.id)
      .onSnapshot((snapshot: firebase.firestore.QuerySnapshot) => {
        snapshot
          .docChanges()
          .forEach((change: firebase.firestore.DocumentData) => {
            console.log(change);
            console.log('HELLO KITTY');
            if (change.type === 'added') {
              if (change.doc.data().userId === user?.id) {
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
    return <div id="reflection-page">Loading...</div>;
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
          {this.state.reflections.map((reflection, key) => {
            return (
              <div key={key} className="reflection">
                {reflection.text}
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
    const user = this.context.user as User | null;
    if (!room || !user) {
      return this.renderLoading();
    }
    if (!this.state.reflectionSubmitted) {
      return this.renderReflectionForm(room, user);
    }
    return this.renderReflectionPage();
  }
}

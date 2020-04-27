import React, { Component } from 'react';
import { firebase } from '../../FirebaseSetup';
import 'firebase/firestore';
import { Link } from 'react-router-dom';
import { Reflection } from '../../storage/Reflection';
import { Room } from '../../storage/Room';
import { UserContext } from '../../providers/UserProvider';
import { User } from '../../storage/User';
import { ReflectionForm } from './ReflectionForm';
import { SignInPage } from '../SignInPage/SignInPage';
import { LoadingPage } from '../LoadingPage/LoadingPage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
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
  reflectionSubmitted: boolean | null;
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
      reflectionSubmitted: null,
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

    // Load reflection data asynchronously.
    this.loadReflections(this.state.room!.id);

    // Create listener for new reflections.
    this.addReflectionListener();
  };

  componentWillUnmount() {
    // Unsubscribe the reflection listener.
    const unsubscribe: () => void = this.reflectionListener!;
    unsubscribe();
  }

  loadRoom = async (roomId: string) => {
    try {
      this.setState({
        room: await Room.Load(roomId),
      });
    } catch (e) {
      this.appendErrorMsg(e.toString());
    }
  };

  loadReflections = async (roomId: string) => {
    try {
      this.setState({
        reflections: await Reflection.LoadForRoom(roomId),
      });
    } catch (e) {
      this.appendErrorMsg(e.toString());
    }
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
            if (change.type === 'added') {
              // Show group reflections if user already submitted.
              if (change.doc.data().userId === user?.id) {
                this.setState({ reflectionSubmitted: true });
              }
              // Check if reflection already exists in state.
              var found = false;
              for (var i = 0; i < this.state.reflections.length; i++) {
                if (this.state.reflections[i].id === change.doc.id) {
                  found = true;
                  break;
                }
              }
              if (!found) {
                Reflection.LoadFromData(change.doc).then(
                  (newReflection: Reflection) => {
                    this.setState((prevState: ReflectionPageState) => {
                      return {
                        reflections: [...prevState.reflections, newReflection],
                      };
                    });
                  }
                );
              }
            }
          });
      });
  }

  renderError() {
    return (
      <div id="reflection-page">
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
                {reflection.user.photoURL ? (
                  <img
                    className="participant-picture"
                    src={reflection.user.photoURL}
                    alt="Profile"
                  />
                ) : (
                  <FontAwesomeIcon
                    className="participant-picture"
                    icon={faUserCircle}
                  ></FontAwesomeIcon>
                )}
                {reflection.text}
              </div>
            );
          })}
        </div>
        <Link to="/">
          <button className="button">Complete Practice</button>
        </Link>
      </div>
    );
  }

  render() {
    const room: Room = this.state.room!;
    const user = this.context.user as User | null;
    if (this.state.errors.length) {
      return this.renderError();
    }
    if (!room) {
      return this.renderLoading();
    }
    if (!user) {
      return <SignInPage destination={`/room/${room.id}`} />;
    }
    if (this.state.reflectionSubmitted === null) {
      return this.renderLoading();
    }
    if (!room.userInRoom(user)) {
      return (
        <div className="center">
          <h1 className="title">
            Sorry! You can't view this room's reflections.
          </h1>
          <Link to="/">
            <button className="button">Browse activities</button>
          </Link>
        </div>
      );
    }
    if (!this.state.reflectionSubmitted) {
      return this.renderReflectionForm(room, user);
    }
    if (!this.state.reflections.length) {
      return this.renderLoading();
    }
    return this.renderReflectionPage();
  }
}

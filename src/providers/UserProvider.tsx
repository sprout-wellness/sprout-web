import React, { Component, createContext } from 'react';
import { firebase } from '../FirebaseSetup';
import { User } from '../storage/User';
import { LoadingPage } from '../components/LoadingPage/LoadingPage';

interface UserState {
  loading: boolean;
  user: User | null;
}

// tslint:disable-next-line:variable-name
export const UserContext = createContext({ user: null });

export class UserProvider extends Component<{}, UserState> {
  state = {
    loading: true,
    user: null,
  };

  componentDidMount = () => {
    firebase.auth().onAuthStateChanged(async firebaseUser => {
      if (firebaseUser === null) {
        this.setState({ loading: false, user: null });
        return;
      }
      const user = await User.Upsert(firebaseUser);
      if (!user) {
        this.setState({ loading: false, user: null });
        return;
      }
      this.setState({ loading: false, user });
    });
  };

  render() {
    if (this.state.loading) {
      return <LoadingPage />;
    }
    return (
      <UserContext.Provider value={this.state}>
        {this.props.children}
      </UserContext.Provider>
    );
  }
}

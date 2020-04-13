import React, { Component, createContext } from 'react';
import { firebase } from '../FirebaseSetup';
import { User } from '../storage/User';
import ClimbingBoxLoader from 'react-spinners/ClimbingBoxLoader';

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
      return (
        <ClimbingBoxLoader
          size={15}
          color={'#64af22'}
          css={`
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: auto;
          `}
          loading={this.state.loading}
        />
      );
    }
    return (
      <UserContext.Provider value={this.state}>
        {this.props.children}
      </UserContext.Provider>
    );
  }
}

import React, { Component, createContext } from 'react';
import { firebase } from '../FirebaseSetup';

interface UserState {
  user: firebase.User | null;
}

// tslint:disable-next-line:variable-name
export const UserContext = createContext({ user: null });

export class UserProvider extends Component<{}, UserState> {
  state = {
    user: null,
  };

  componentDidMount = () => {
    firebase.auth().onAuthStateChanged(user => {
      this.setState({ user });
    });
  };

  render() {
    return (
      <UserContext.Provider value={this.state}>
        {this.props.children}
      </UserContext.Provider>
    );
  }
}

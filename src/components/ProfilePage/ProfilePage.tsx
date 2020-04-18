import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { UserContext } from '../../providers/UserProvider';
import { User } from '../../storage/User';

export class ProfilePage extends Component<{}, {}> {
  static contextType = UserContext;

  componentDidMount() {
    const user = this.context.user as User | null;
    if (user === null) {
      return;
    }
    
  }

  render() {
    const user = this.context.user as User | null;
    if (user === null) {
      return <Redirect to="/signin" />;
    }
    return (
      <div>
        ID: {user.id}
        <br />
        Display Name: {user.displayName}
        <br />
        Profile Picture:{' '}
        {user.photoURL !== null ? (
          <img src={user.photoURL} alt="profile" />
        ) : (
          'none'
        )}
        <br />
        Level: {user.level}
      </div>
    );
  }
}

import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { UserContext } from '../../providers/UserProvider';
import { User } from '../../storage/User';
import { History } from '../../storage/History';

interface ProfilePageState {
  userHistory: History | null;
}

export class ProfilePage extends Component<{}, ProfilePageState> {
  static contextType = UserContext;

  state = {
    userHistory: null,
  };

  componentDidMount() {
    const user = this.context.user as User | null;
    if (user === null) {
      return;
    }
    (async () => {
      this.setState({
        userHistory: await user.getHistory(),
      });
    })();
  }

  render() {
    const user = this.context.user as User | null;
    if (user === null) {
      return <Redirect to="/signin" />;
    }
    let historyHtml = [<p key="loading">Loading...</p>];
    if (this.state.userHistory != null) {
      const history: History = this.state.userHistory!;
      if (!history.reflections.length) {
        historyHtml = [<p key="none">Go try some activities!</p>];
      } else {
        historyHtml = history.reflections.map((reflection, key) => {
          return (
            <div key={key}>
              <p>Time: {new Date(reflection.datetime).toString()}</p>
              <p>Acitivity: {reflection.activity.name}</p>
              <p>Reflection: {reflection.text}</p>
            </div>
          );
        });
      }
    }
    return (
      <div>
        <h2>Profile</h2>
        <p>ID: {user.id}</p>
        <p>Display Name: {user.displayName}</p>
        <p>
          Profile Picture:{' '}
          {user.photoURL !== null ? (
            <img src={user.photoURL} alt="profile" height="100px;" />
          ) : (
            'none'
          )}
        </p>
        <br />
        Level: {user.level}
        <h2>History</h2>
        {historyHtml}
      </div>
    );
  }
}

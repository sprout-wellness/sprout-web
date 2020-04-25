import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { UserContext } from '../../providers/UserProvider';
import { User } from '../../storage/User';
import { Reflection } from '../../storage/Reflection';

interface ProfilePageState {
  userHistory: Reflection[] | null;
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

  renderHistory() {
    let historyHtml = [<p key="loading">Loading...</p>];
    if (this.state.userHistory != null) {
      const history: Reflection[] = this.state.userHistory!;
      if (!history.length) {
        historyHtml = [<p key="none">Go try some activities!</p>];
      } else {
        historyHtml = history.map((reflection, key) => {
          return (
            <div key={key}>
              <p>Time: {new Date(reflection.datetime).toString()}</p>
              <p>Activity: {reflection.activity?.name}</p>
              <p>Reflection: {reflection.text}</p>
            </div>
          );
        });
      }
    }
    return historyHtml;
  }

  render() {
    const user = this.context.user as User | null;
    if (user === null) {
      return <Redirect to="/signin" />;
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
        {this.renderHistory()}
      </div>
    );
  }
}

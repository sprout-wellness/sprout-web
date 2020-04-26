import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { UserContext } from '../../providers/UserProvider';
import { User } from '../../storage/User';
import { Reflection } from '../../storage/Reflection';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import './ProfilePage.scss';

interface ProfilePageState {
  pastActivities: Reflection[] | null;
}

export class ProfilePage extends Component<{}, ProfilePageState> {
  static contextType = UserContext;

  state = {
    pastActivities: null,
  };

  componentDidMount() {
    const user = this.context.user as User | null;
    if (user === null) {
      return;
    }
    (async () => {
      this.setState({
        pastActivities: await user.getHistory(),
      });
    })();
  }

  renderPastActivities() {
    let historyHtml = [<p key="loading">Loading...</p>];
    if (this.state.pastActivities != null) {
      const history: Reflection[] = this.state.pastActivities!;
      if (!history.length) {
        historyHtml = [<p key="none">Go try some activities!</p>];
      } else {
        historyHtml = history.map((reflection, key) => {
          return (
            <div className="past-activity" key={key}>
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
      <div id="profile-page">
        <div id="profile-container">
          {user.photoURL !== null ? (
            <img id="profile-picture" src={user.photoURL} alt="profile" />
          ) : (
            <FontAwesomeIcon
              id="profile-picture"
              icon={faUserCircle}
            ></FontAwesomeIcon>
          )}
          <div id="profile-info">
            <h3 id="name">{user.displayName}</h3>
            <p>ID: {user.id}</p>
            <p>Level: {user.level}</p>
          </div>
        </div>

        <h2>Past Activities</h2>
        <div id="past-activities-container">{this.renderPastActivities()}</div>
      </div>
    );
  }
}

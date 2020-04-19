import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { firebase } from '../../FirebaseSetup';
import { UserContext } from '../../providers/UserProvider';
import { User } from '../../storage/User';
import './NavBar.scss';

export class NavBar extends Component<{}, {}> {
  static contextType = UserContext;

  signOut() {
    firebase.auth().signOut();
  }

  render() {
    const user = this.context.user as User | null;
    if (user === null) {
      return (
        <div id="navbar">
          <ul>
            <li id="home">
              <Link to="/">
                <img
                  src={require('../../images/sprout-logo.png')}
                  alt="Home"
                ></img>
              </Link>
            </li>
            <li className="text">
              <Link to="/signin">Sign In</Link>
            </li>
          </ul>
        </div>
      );
    }
    return (
      <div id="navbar">
        <ul>
          <li id="home">
            <Link to="/">
              <img
                id="sprout-logo"
                src={require('../../images/sprout-logo.png')}
                alt="Home"
              ></img>
            </Link>
          </li>
          <li className="text">Welcome, {user.displayName}!</li>
          <div className="dropdown">
            {user.photoURL && (
              <li className="dropbtn">
                <img id="profile-picture" src={user.photoURL} alt="Profile" />
              </li>
            )}
            {!user.photoURL && (
              <li className="dropbtn">
                <FontAwesomeIcon
                  id="profile-picture"
                  icon={faUserCircle}
                ></FontAwesomeIcon>
              </li>
            )}
            <div className="dropdown-content">
              <li className="text link">
                <Link to="/profile">Profile</Link>
              </li>
              <li className="text link" onClick={() => this.signOut()}>
                Sign Out
              </li>
            </div>
          </div>
        </ul>
      </div>
    );
  }
}

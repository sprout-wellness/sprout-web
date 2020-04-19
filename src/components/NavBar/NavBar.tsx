import React, { Component } from 'react';
import { Link, useHistory} from 'react-router-dom';
import './NavBar.scss';
import { firebase } from '../../FirebaseSetup';
import { UserContext } from '../../providers/UserProvider';
import { User } from '../../storage/User';
import { faWindowRestore } from '@fortawesome/free-solid-svg-icons';

const history = useHistory
export class NavBar extends Component<{}, {}> {
  static contextType = UserContext;

  signOutButton() {
    firebase.auth().signOut();
  }

  render() {
    const user = this.context.user as User | null;
    if (user === null) {
      return (
        <div id="navbar">
          <ul>
            <li id="home">
              <Link to="/">Home</Link>
            </li>
            <li>
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
            <Link to="/">Home</Link>
          </li>
          {user.photoURL && (
            <li>
              <img src={user.photoURL} alt="Profile." />
            </li>
          )}
          <li id="welcome">Welcome, {user.displayName}!</li>
          <li>
            <Link to="/">Profile</Link>
          </li>
          <li>
          <Link to="/"><button onClick={() => this.signOutButton()}>Sign Out</button></Link>
          </li>
        </ul>
      </div>
    );
  }
}

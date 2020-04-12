import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './NavBar.scss';
import { firebase } from '../../FirebaseSetup';
import * as firebaseui from 'firebaseui';
import { auth } from 'firebase';

export class NavBar extends Component<{}, {}> {
  componentDidMount() {
    const uiConfig = {
      signInSuccessUrl: '/login',
      signInOptions: [
        auth.GoogleAuthProvider.PROVIDER_ID,
        auth.EmailAuthProvider.PROVIDER_ID,
        firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID,
      ],
      signInFlow: 'popup',
      tosUrl: 'https://google.com',
      privacyPolicyUrl: 'https://google.com',
    };
    const ui = new firebaseui.auth.AuthUI(firebase.auth());
    ui.start('#firebaseui-auth-container', uiConfig);
  }

  render() {
    return (
      <div id="navbar">
        <ul>
          <li id="home">
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/">Profile</Link>
          </li>
          <li>
            <div id="firebaseui-auth-container"></div>
          </li>
        </ul>
      </div>
    );
  }
}

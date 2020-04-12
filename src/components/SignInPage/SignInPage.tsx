import React, { Component } from 'react';
import { firebase } from '../../FirebaseSetup';
import * as firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';
import { auth } from 'firebase';
import { UserContext } from '../../providers/UserProvider';
import { Redirect } from 'react-router-dom';

export class SignInPage extends Component<{}, {}> {
  static contextType = UserContext;

  componentDidMount() {
    const uiConfig = {
      signInSuccessUrl: '/',
      signInOptions: [
        {
          provider: auth.GoogleAuthProvider.PROVIDER_ID,
          // Required to enable this provider in One-Tap Sign-up.
          authMethod: 'https://accounts.google.com',
          clientId:
            '658431260118-s465l1s02cqje4bkpp209o9qsekogssf.apps.googleusercontent.com',
          customParameters: {
            // Forces account selection even when one account is available.
            prompt: 'select_account',
          },
        },
        auth.EmailAuthProvider.PROVIDER_ID,
      ],
      signInFlow: 'popup',
      tosUrl: 'https://google.com',
      privacyPolicyUrl: 'https://google.com',
    };
    const ui = new firebaseui.auth.AuthUI(firebase.auth());
    ui.start('#firebaseui-auth-container', uiConfig);
  }

  render() {
    const user = this.context.user as firebase.User | null;
    if (user !== null) {
      return <Redirect to="/" />;
    }
    return <div id="firebaseui-auth-container"></div>;
  }
}

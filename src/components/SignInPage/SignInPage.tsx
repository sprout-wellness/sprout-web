import React, { Component } from 'react';
import { firebase } from '../../FirebaseSetup';
import { auth } from 'firebase/app';
import * as firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';
import { UserContext } from '../../providers/UserProvider';
import { Redirect } from 'react-router-dom';
import { User } from '../../storage/User';
import './SignInPage.scss';

interface SignInPageState {
  firebaseUi: firebaseui.auth.AuthUI | undefined;
}

interface SignInPageProps {
  destination: string;
}

export class SignInPage extends Component<SignInPageProps, SignInPageState> {
  static contextType = UserContext;

  state = {
    firebaseUi: undefined,
  };

  componentDidMount() {
    const uiConfig = {
      signInSuccessUrl: this.props.destination || '/',
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
    const ui =
      firebaseui.auth.AuthUI.getInstance() ||
      new firebaseui.auth.AuthUI(firebase.auth());
    ui.start('#firebaseui-auth-container', uiConfig);
    this.setState({ firebaseUi: ui });
  }

  componentWillUnmount() {
    const ui: firebaseui.auth.AuthUI = this.state.firebaseUi!;
    ui.delete();
  }

  render() {
    const user = this.context.user as User | null;
    if (user !== null) {
      return <Redirect to="/" />;
    }
    return (
      <div id="signin-page">
        <h1 className="title">Sign in</h1>
        <div id="firebaseui-auth-container"></div>
      </div>
    );
  }
}

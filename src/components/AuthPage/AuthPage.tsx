
import React, { Component } from 'react'
import * as fb from 'firebase/app'
import * as fbui from 'firebaseui' 
import { firebase } from '../../FirebaseSetup'
import 'firebase/auth'

import { User } from '../../storage/User'

const uiConfig = {
  signInSuccessURL: '/',
  signInOptions: [
    fb.auth.EmailAuthProvider.PROVIDER_ID,
    fb.auth.GoogleAuthProvider.PROVIDER_ID
  ],
  
}
const ui = new fbui.auth.AuthUI(firebase.auth())

export class AuthPage extends Component{
  constructor(props: any){
    super(props)
    this.state = {
      user: null
    }
  }
  
  componentDidMount(){
    ui.start('#fbui-container', uiConfig)
  }

  render(){
    return(
      <div id="fbui-container"></div>
    )
  }
}
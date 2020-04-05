// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
import * as fb from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyBgKAC5vrSSFfZsCxi1wpVdwk3ZbNlYuIo',
  authDomain: 'sprout-wellness.firebaseapp.com',
  databaseURL: 'https://sprout-wellness.firebaseio.com',
  projectId: 'sprout-wellness',
  storageBucket: 'sprout-wellness.appspot.com',
  messagingSenderId: '658431260118',
  appId: '1:658431260118:web:9513c73b085c8eadd22077',
  measurementId: 'G-MYV1VZM8G9',
};

export const firebase = !fb.apps.length
  ? fb.initializeApp(firebaseConfig)
  : fb.app();

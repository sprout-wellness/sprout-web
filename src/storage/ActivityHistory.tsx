import { firebase } from '../FirebaseSetup';
import 'firebase/firestore';

export class ActivityHistory {
  activities: [];

  static async LoadAllForUser(userId: string) {
    const querySnap = firebase.firestore().collection('rooms').where('startTime', '>=', 0)
    .where('attendees', 'array-contains', userId).orderBy('startTime', 'desc').limit(20).get();
    (await querySnap).forEach(result => {
      result.data().activity;
    });
  }
}
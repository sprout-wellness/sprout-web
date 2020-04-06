import { firebase } from '../FirebaseSetup';
import 'firebase/firestore';
import { User } from './User';
import { Activity } from './Activity';

export class Room {
  readonly id: string;
  readonly activity: Activity;
  readonly attendees: User[];
  readonly startTime: Date | undefined;

  private constructor(
    id: string,
    activity: Activity,
    attendees: User[],
    startTime: Date | undefined
  ) {
    this.id = id;
    this.activity = activity;
    this.attendees = attendees;
    this.startTime = startTime;
  }

  private save(callback: (room: Room) => void) {
    firebase
      .firestore()
      .collection('rooms')
      .doc(this.id)
      .set({
        activity: this.activity.id,
        attendees: this.attendees.map((user) => user.id),
      })
      .then((done) => {
        callback(this);
      })
      .catch((reason) => {
        console.log(`Room ${this.id} could not be created.`, reason);
      });
  }

  static Begin(id: string) {
    firebase
      .firestore()
      .collection('rooms')
      .doc(id)
      .update({
        startTime: new Date(),
      })
      .catch((reason) => {
        console.log(`Room ${id} could not be created.`, reason);
      });
  }

  static Load(id: string, callback: (room?: Room) => void) {
    firebase
      .firestore()
      .collection('rooms')
      .doc(id)
      .get()
      .then((roomSnap) => {
        if (!roomSnap.exists) {
          console.log(`Room ${id} does not exist.`);
          return callback(undefined);
        }

        let callbacksInFlight = 1 + roomSnap.data()!.attendees.length;
        let activity: Activity;
        const users = [] as User[];
        function checkFinished() {
          if (!callbacksInFlight) {
            callback(
              new Room(roomSnap.id, activity, users, roomSnap.data()!.startTime)
            );
          }
        }

        function activityLoaded(act?: Activity) {
          if (act) {
            activity = act;
          }
          callbacksInFlight--;
          checkFinished();
        }
        Activity.Load(roomSnap.data()!.activity.toString(), activityLoaded);

        function userLoaded(user?: User) {
          if (user) {
            users.push(user);
          }
          callbacksInFlight--;
          checkFinished();
        }
        for (const userRef of roomSnap.data()!.attendees) {
          User.Load(userRef.id, userLoaded);
        }
      })
      .catch((reason) => {
        console.log(`Room ${id} could not be loaded.`, reason);
        return callback(undefined);
      });
  }

  static Create(activity: Activity, callback: (room: Room) => void) {
    const randomId = firebase.firestore().collection('rooms').doc().id;
    const room = new Room(randomId, activity, [], undefined);
    room.save(callback);
  }
}

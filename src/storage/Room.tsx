import { firebase } from '../FirebaseSetup';
import 'firebase/firestore';
import { User } from './User';
import { Activity } from './Activity';

export class Room {
  readonly id: string;
  readonly activity: Activity;
  readonly attendees: User[];
  readonly startTime: number;

  private constructor(
    id: string,
    activity: Activity,
    attendees: User[],
    startTime: number
  ) {
    this.id = id;
    this.activity = activity;
    this.attendees = attendees;
    this.startTime = startTime;
  }

  private save() {
    const resultPromise = new Promise<void>((resolve, reject) => {
      firebase
        .firestore()
        .collection('rooms')
        .doc(this.id)
        .set({
          activity: this.activity.id,
          attendees: this.attendees.map(user => user.id),
        })
        .then(_ => {
          resolve();
        })
        .catch(reason => {
          console.log(`Room ${this.id} could not be created.`, reason);
          reject();
        });
    });
    return resultPromise;
  }

  static Begin(id: string) {
    firebase
      .firestore()
      .collection('rooms')
      .doc(id)
      .update({
        startTime: new Date().getTime(),
      })
      .catch(reason => {
        console.log(`Room ${id} could not be created.`, reason);
      });
  }

  static async Load(id: string): Promise<Room> {
    const roomSnap = await firebase
      .firestore()
      .collection('rooms')
      .doc(id)
      .get();
    if (!roomSnap.exists) {
      throw Error(`Room ${id} does not exist.`);
    }
    return this.LoadFromData(roomSnap);
  }

  static async LoadFromData(
    roomSnap: firebase.firestore.DocumentSnapshot
  ): Promise<Room> {
    const activity = await Activity.LoadActivity(
      roomSnap.data()!.activity.toString()
    );
    const users = [] as User[];
    for (const userId of roomSnap.data()!.attendees) {
      users.push(await User.Load(userId));
    }
    return new Room(roomSnap.id, activity!, users, roomSnap.data()!.startTime);
  }

  static async Create(creator: User, activity: Activity) {
    const randomId = firebase
      .firestore()
      .collection('rooms')
      .doc().id;
    const room = new Room(randomId, activity, [creator], -1);
    await room.save();
    return room.id;
  }
}

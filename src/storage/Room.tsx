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

  private async save() {
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

  static async Load(id: string) {
    const resultPromise = new Promise<Room | undefined>((resolve, reject) => {
      firebase
        .firestore()
        .collection('rooms')
        .doc(id)
        .get()
        .then(async roomSnap => {
          if (!roomSnap.exists) {
            console.log(`Room ${id} does not exist.`);
            reject(undefined);
          }

          // Fetch room activity.
          const activity = await Activity.LoadActivity(
            roomSnap.data()!.activity.toString()
          );

          // Fetch attendees.
          const users = [] as User[];
          for (const userRef of roomSnap.data()!.attendees) {
            const user = await User.Load(userRef.id);
            users.push(user!);
          }

          resolve(
            new Room(roomSnap.id, activity!, users, roomSnap.data()!.startTime)
          );
        })
        .catch(reason => {
          console.log(`Room ${id} could not be loaded.`, reason);
          reject(undefined);
        });
    });
    return await resultPromise;
  }

  static async Create(activity: Activity) {
    const randomId = firebase
      .firestore()
      .collection('rooms')
      .doc().id;
    const room = new Room(randomId, activity, [], -1);
    await room.save();
    return room.id;
  }
}

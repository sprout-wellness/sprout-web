import { firebase } from '../FirebaseSetup';
import 'firebase/firestore';
import { User } from './User';
import { Activity } from './Activity';
import { Room } from './Room';

export class Reflection {
  readonly id: string;
  readonly activity: Activity;
  readonly room: Room;
  readonly user: User;
  readonly text: string;
  readonly datetime: number;

  private constructor(
    id: string,
    activity: Activity,
    room: Room,
    user: User,
    text: string,
    datetime: number
  ) {
    this.id = id;
    this.activity = activity;
    this.room = room;
    this.user = user;
    this.text = text;
    this.datetime = datetime;
  }

  private save() {
    const resultPromise = new Promise<void>((resolve, reject) => {
      firebase
        .firestore()
        .collection('reflections')
        .doc(this.id)
        .set({
          activityId: this.activity.id,
          roomId: this.room.id,
          userId: this.user.id,
          text: this.text,
          datetime: this.datetime,
        })
        .then(done => {
          resolve();
        })
        .catch(reason => {
          console.log(`Reflection ${this.id} could not be created.`, reason);
          reject();
        });
    });
    return resultPromise;
  }

  static async LoadFromData(
    reflectionSnap: firebase.firestore.DocumentSnapshot
  ): Promise<Reflection> {
    return new Reflection(
      reflectionSnap.id,
      await Activity.LoadActivity(reflectionSnap.data()!.activityId),
      await Room.Load(reflectionSnap.data()!.roomId),
      await User.Load(reflectionSnap.data()!.userId),
      reflectionSnap.data()!.text,
      reflectionSnap.data()!.datetime
    );
  }

  static async LoadForRoom(roomId: string): Promise<Reflection[]> {
    const querySnap = await firebase
      .firestore()
      .collection('reflections')
      .where('roomId', '==', roomId)
      .get();
    const reflections = [] as Reflection[];
    // Covert all reflection data to reflection objects in parallel.
    await Promise.all(
      querySnap.docs.map(async reflectionSnap => {
        reflections.push(await Reflection.LoadFromData(reflectionSnap));
      })
    );
    return reflections;
  }

  static async LoadLatestForUser(
    userId: string,
    limit: number
  ): Promise<Reflection[]> {
    const querySnap = await firebase
      .firestore()
      .collection('reflections')
      .where('userId', '==', userId)
      .orderBy('datetime', 'desc')
      .limit(limit)
      .get();
    const reflections = [] as Reflection[];
    // Covert all reflection data to reflection objects in parallel.
    await Promise.all(
      querySnap.docs.map(async reflectionSnap => {
        reflections.push(await Reflection.LoadFromData(reflectionSnap));
      })
    );
    return reflections;
  }

  static async Create(room: Room, user: User, text: string) {
    const randomId = firebase
      .firestore()
      .collection('reflections')
      .doc().id;
    const reflection = new Reflection(
      randomId,
      room.activity,
      room,
      user,
      text,
      room.getStartTime()
    );
    await reflection.save();
    return reflection;
  }

  static ReflectionExists(roomId: string, userId: string) {
    const resultPromise = new Promise<boolean>((resolve, reject) => {
      firebase
        .firestore()
        .collection('reflections')
        .where('roomId', '==', roomId)
        .where('userId', '==', userId)
        .get()
        .then(reflectionSnap => {
          if (!reflectionSnap.size) {
            resolve(false);
          }
          resolve(true);
        })
        .catch(reason => {
          console.log(
            `Something went wrong when checking existence of a reflection:`,
            reason
          );
          reject();
        });
    });
    return resultPromise;
  }
}

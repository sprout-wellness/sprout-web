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

  private constructor(
    id: string,
    activity: Activity,
    room: Room,
    user: User,
    text: string
  ) {
    this.id = id;
    this.activity = activity;
    this.room = room;
    this.user = user;
    this.text = text;
  }

  private save(callback: (reflection: Reflection) => void) {
    firebase
      .firestore()
      .collection('reflections')
      .doc(this.id)
      .set({
        activity: this.activity.id,
        room: this.room.id,
        user: this.user.id,
        text: this.text,
      })
      .then(done => {
        callback(this);
      })
      .catch(reason => {
        console.log(`Reflection ${this.id} could not be created.`, reason);
      });
  }

  static Create(
    room: Room,
    user: User,
    text: string,
    callback: (reflection: Reflection) => void
  ) {
    const randomId = firebase
      .firestore()
      .collection('reflections')
      .doc().id;
    const reflection = new Reflection(
      randomId,
      room.activity,
      room,
      user,
      text
    );
    reflection.save(callback);
  }

  static ReflectionExists(
    roomId: string,
    userId: string,
    callback: (exists: boolean) => void
  ) {
    firebase
      .firestore()
      .collection('reflections')
      .where('room', '==', roomId)
      .where('user', '==', userId)
      .get()
      .then(reflectionSnap => {
        if (!reflectionSnap.size) {
          return callback(false);
        }
        return callback(true);
      })
      .catch(reason => {
        console.log(
          `Something went wrong when checking existence of a reflection:`,
          reason
        );
        return callback(false);
      });
  }
}

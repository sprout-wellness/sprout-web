import { firebase } from '../FirebaseSetup';
import 'firebase/firestore';
import { Reflection } from './Reflection';

export class User {
  readonly id: string;
  readonly displayName: string;
  readonly photoURL: string | null;
  readonly level: number;

  private constructor(
    id: string,
    displayName: string,
    photoURL: string | null,
    level: number
  ) {
    this.id = id;
    this.displayName = displayName;
    this.photoURL = photoURL;
    this.level = level;
  }

  async getHistory() {
    return Reflection.LoadLatestForUser(this.id, 20);
  }

  static async Upsert(firebaseUser: firebase.User): Promise<User> {
    try {
      await firebase
        .firestore()
        .collection('users')
        .doc(firebaseUser.uid)
        .update({
          displayName: firebaseUser.displayName!,
          photoURL: firebaseUser.photoURL,
        });
    } catch (error) {
      console.log(`Creating new user ${firebaseUser.uid}.`);
      await firebase
        .firestore()
        .collection('users')
        .doc(firebaseUser.uid)
        .set({
          displayName: firebaseUser.displayName!,
          photoURL: firebaseUser.photoURL,
          level: 1,
        });
    }
    return User.Load(firebaseUser.uid);
  }

  static async Load(id: string): Promise<User> {
    const userSnap = await firebase
      .firestore()
      .collection('users')
      .doc(id)
      .get();
    if (!userSnap.exists) {
      throw new Error(`User ${id} does not exist.`);
    }
    return new User(
      id,
      userSnap.data()!.displayName,
      userSnap.data()!.photoURL,
      userSnap.data()!.level
    );
  }
}

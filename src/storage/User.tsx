import { firebase } from '../FirebaseSetup';
import 'firebase/firestore';

export class User {
  readonly id: string;
  readonly name: string;

  private constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }

  private save() {
    const resultPromise = new Promise<void>((resolve, reject) => {
      firebase
        .firestore()
        .collection('users')
        .doc(this.id)
        .set({
          name: this.name
        })
        .then(done => {
          resolve();
        })
        .catch(reason => {
          console.log(`User ${this.id} could not be created.`, reason);
          reject();
        });
    });
    return resultPromise;
  }

  static async Create(id: string, name: string) {
    const user = new User(
      id,
      name
    );
    await user.save();
    return user;
  }

  static Load(id: string): Promise<User | undefined> {
    const resultPromise = new Promise<User | undefined>((resolve, reject) => {
      firebase
        .firestore()
        .collection('users')
        .doc(id)
        .get()
        .then(userSnap => {
          if (!userSnap.exists) {
            console.log(`User ${id} does not exist.`);
            reject(undefined);
          }
          resolve(new User(userSnap.id, userSnap.data()!.name));
        })
        .catch(reason => {
          console.log(`User ${id} could not be loaded.`, reason);
          reject(undefined);
        });
    });
    return resultPromise;
  }
}

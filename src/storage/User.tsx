import { firebase } from '../FirebaseSetup';
import 'firebase/firestore';

export class User {
  readonly id: string;
  readonly name: string;

  private constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }

  static async Load(id: string): Promise<User | undefined> {
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
    return await resultPromise;
  }
}

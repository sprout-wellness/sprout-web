import { firebase } from '../FirebaseSetup';
import 'firebase/firestore';

export class User {
  readonly id: string;
  readonly name: string;

  private constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }

  private save(callback: (user: User) => void){
      firebase 
        .firestore()
        .collection('users')
        .doc(this.id)
        .set({
          name: this.name
        })
        .then(done => {
          callback(this)
        })
        .catch(reason => {
          console.log(`User ${this.id} could not be created` + reason)
        })
  }

  static Create(
    id: string,
    name: string,
    callback: (user: User) => void) {
      const user = new User(
        id,
        name
      );
    user.save(callback);
  }

  static Load(id: string, callback: (user?: User) => void) {
    firebase
      .firestore()
      .collection('users')
      .doc(id)
      .get()
      .then(userSnap => {
        if (!userSnap.exists) {
          console.log(`User ${id} does not exist.`);
          return callback(undefined);
        }
        callback(new User(userSnap.id, userSnap.data()!.name));
      })
      .catch(reason => {
        console.log(`User ${id} could not be loaded.`, reason);
        return callback(undefined);
      });
  }
}

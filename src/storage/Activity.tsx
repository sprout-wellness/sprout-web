import { firebase } from '../FirebaseSetup';
import 'firebase/firestore';

export class Activity {
  readonly id: number;
  readonly name: string;
  readonly category: string;
  readonly instructions: string;
  readonly motivation: string;
  readonly time: number;

  private constructor(
    id: string,
    name: string,
    category: string,
    instructions: string,
    motivation: string,
    time: string
  ) {
    this.id = Number(id);
    this.name = name;
    this.category = category;
    this.instructions = instructions;
    this.motivation = motivation;
    this.time = Number(time);
  }

  static LoadFromSnapshot(
    activitySnap: firebase.firestore.QueryDocumentSnapshot
  ) {
    return new Activity(
      activitySnap.id,
      activitySnap.data().name,
      activitySnap.data().category,
      activitySnap.data().instructions,
      activitySnap.data().motivation,
      activitySnap.data().time
    );
  }

  static Load(id: string, callback: (activity?: Activity) => void) {
    firebase
      .firestore()
      .collection('activities')
      .doc(id)
      .get()
      .then(activitySnap => {
        if (!activitySnap.exists) {
          console.log(`Activity ${id} does not exist.`);
          return callback(undefined);
        }
        callback(
          new Activity(
            activitySnap.id,
            activitySnap.data()!.name,
            activitySnap.data()!.category,
            activitySnap.data()!.instructions,
            activitySnap.data()!.motivation,
            activitySnap.data()!.time
          )
        );
      })
      .catch(reason => {
        console.log(`Activity ${id} could not be loaded.`, reason);
        return callback(undefined);
      });
  }
}

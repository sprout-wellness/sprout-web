import { firebase } from '../FirebaseSetup';
import 'firebase/firestore';

export class Activity {
  readonly id: number;
  readonly name: string;
  readonly category: string;
  readonly instructions: string;
  readonly motivation: string;
  readonly time: number;
  readonly blurb: string;

  private constructor(
    id: string,
    name: string,
    category: string,
    instructions: string,
    motivation: string,
    time: string,
    blurb: string
  ) {
    this.id = Number(id);
    this.name = name;
    this.category = category;
    this.instructions = instructions;
    this.motivation = motivation;
    this.time = Number(time);
    this.blurb = blurb;
  }

  static LoadActivity(id: string): Promise<Activity> {
    const resultPromise = new Promise<Activity>((resolve, reject) => {
      firebase
        .firestore()
        .collection('activities')
        .doc(id)
        .get()
        .then(activitySnap => {
          if (!activitySnap.exists) {
            console.log(`Activity ${id} does not exist.`);
            reject();
          }
          resolve(
            new Activity(
              activitySnap.id,
              activitySnap.data()!.name,
              activitySnap.data()!.category,
              activitySnap.data()!.instructions,
              activitySnap.data()!.motivation,
              activitySnap.data()!.time,
              activitySnap.data()!.blurb
            )
          );
        })
        .catch(reason => {
          console.log(`Activity ${id} could not be loaded.`, reason);
          reject();
        });
    });
    return resultPromise;
  }

  static LoadActivitiesInTenet(tenetId: string): Promise<Activity[]> {
    const resultPromise = new Promise<Activity[]>((resolve, reject) => {
      const activities: Activity[] = [];
      firebase
        .firestore()
        .collection('activities')
        .where('category', '==', tenetId)
        .get()
        .then(querySnap => {
          querySnap.forEach(
            (activitySnap: firebase.firestore.QueryDocumentSnapshot) => {
              activities.push(
                new Activity(
                  activitySnap.id,
                  activitySnap.data().name,
                  activitySnap.data().category,
                  activitySnap.data().instructions,
                  activitySnap.data().motivation,
                  activitySnap.data().time,
                  activitySnap.data().blurb
                )
              );
            }
          );
          resolve(activities);
        })
        .catch(reason => {
          console.log(
            `Activities for tenet ${tenetId} could not be retrieved.`,
            reason
          );
          reject();
        });
    });
    return resultPromise;
  }
}

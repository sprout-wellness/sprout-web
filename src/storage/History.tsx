import { firebase } from '../FirebaseSetup';
import 'firebase/firestore';
import { Reflection } from './Reflection';

export class History {
  readonly reflections: Reflection[];

  private constructor(reflections: Reflection[]) {
    this.reflections = reflections;
  }

  static async LoadForUser(userId: string): Promise<History> {
    return this.LoadLatestForUser(userId, 20);
  }

  static async LoadLatestForUser(
    userId: string,
    limit: number
  ): Promise<History> {
    console.log(userId);
    const querySnap = await firebase
      .firestore()
      .collection('reflections')
      .where('userId', '==', userId)
      .orderBy('datetime', 'desc')
      .limit(limit)
      .get();
    console.log(querySnap);
    const reflections = [] as Reflection[];
    // Covert all reflection data to reflection objects in parallel.
    await Promise.all(
      querySnap.docs.map(async reflectionSnap => {
        reflections.push(await Reflection.LoadFromData(reflectionSnap));
      })
    );
    return new History(reflections);
  }
}

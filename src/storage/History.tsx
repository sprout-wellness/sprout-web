import { firebase } from '../FirebaseSetup';
import 'firebase/firestore';
import { Room } from './Room';

export class History {
  readonly rooms: Room[];

  private constructor(rooms: Room[]) {
    this.rooms = rooms;
  }

  static async LoadForUser(userId: string): Promise<History> {
    return this.LoadLatestForUser(userId, 20);
  }

  static async LoadLatestForUser(
    userId: string,
    limit: number
  ): Promise<History> {
    const querySnap = await firebase
      .firestore()
      .collection('rooms')
      .where('startTime', '>=', 0)
      .where('attendees', 'array-contains', userId)
      .orderBy('startTime', 'desc')
      .limit(limit)
      .get();
    const rooms = [] as Room[];
    // Covert all room data to room objects in parallel.
    await Promise.all(
      querySnap.docs.map(async roomSnap => {
        rooms.push(await Room.LoadFromData(roomSnap));
      })
    );
    return new History(rooms);
  }
}

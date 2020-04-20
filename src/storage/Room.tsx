import { firebase } from '../FirebaseSetup';
import 'firebase/firestore';
import { User } from './User';
import { Activity } from './Activity';
import { arraysEqual } from '../utils/primitives';

export class Room {
  readonly id: string;
  readonly activity: Activity;
  private attendees: User[];
  private startTime: number;

  private constructor(
    id: string,
    activity: Activity,
    attendees: User[],
    startTime: number
  ) {
    this.id = id;
    this.activity = activity;
    this.attendees = attendees;
    this.startTime = startTime;

    // Observe real time changes and update object accordingly.
    firebase
      .firestore()
      .collection('rooms')
      .doc(this.id)
      .onSnapshot(async roomSnap => {
        if (
          !arraysEqual(
            roomSnap.data()!.attendees,
            this.attendees.map(user => user.id)
          )
        ) {
          const users = [] as User[];
          for (const userId of roomSnap.data()!.attendees) {
            users.push(await User.Load(userId));
          }
          this.attendees = users;
        }
        if (startTime !== this.startTime) {
          this.startTime = startTime;
        }
      });
  }

  getAttendees(): User[] {
    return this.attendees;
  }

  getStartTime(): number {
    return this.startTime;
  }

  activityHasBegun(): boolean {
    return this.startTime > 0;
  }

  getActivityMinutesPassed(clock: Date): number {
    return (clock.getTime() - this.startTime) / 1000;
  }

  activityIsInSession(clock: Date): boolean {
    if (this.startTime < 0) {
      return false;
    }
    return this.getActivityMinutesPassed(clock) < this.activity.time * 60;
  }

  userInRoom(user: User): boolean {
    return (
      this.attendees.filter(attendee => attendee.id === user.id).length > 0
    );
  }

  private async save(): Promise<void> {
    await firebase
      .firestore()
      .collection('rooms')
      .doc(this.id)
      .set({
        activity: this.activity.id,
        attendees: this.attendees.map(user => user.id),
        startTime: this.startTime,
      });
  }

  async begin(): Promise<void> {
    this.startTime = new Date().getTime();
    await this.save();
  }

  async join(user: User): Promise<void> {
    if (this.userInRoom(user)) {
      return;
    }
    this.attendees.push(user);
    await this.save();
  }

  static async Load(id: string): Promise<Room> {
    const roomSnap = await firebase
      .firestore()
      .collection('rooms')
      .doc(id)
      .get();
    if (!roomSnap.exists) {
      throw Error(`Room ${id} does not exist.`);
    }
    return this.LoadFromData(roomSnap);
  }

  static async LoadFromData(
    roomSnap: firebase.firestore.DocumentSnapshot
  ): Promise<Room> {
    const activity = await Activity.LoadActivity(
      roomSnap.data()!.activity.toString()
    );
    const users = [] as User[];
    for (const userId of roomSnap.data()!.attendees) {
      users.push(await User.Load(userId));
    }
    return new Room(roomSnap.id, activity!, users, roomSnap.data()!.startTime);
  }

  static async Create(creator: User, activity: Activity): Promise<string> {
    const randomId = firebase
      .firestore()
      .collection('rooms')
      .doc().id;
    const room = new Room(randomId, activity, [creator], -1);
    await room.save();
    return room.id;
  }
}

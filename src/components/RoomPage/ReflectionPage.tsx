import React, { Component } from 'react';
import { Room } from '../../storage/Room';
import { Reflection } from '../../storage/Reflection';
import { User } from '../../storage/User';
import './RoomPage.scss';

interface ReflectionPageProps {
  room: Room;
  user: User;
}

interface ReflectionPageState {
  reflectionText: string;
}

export class ReflectionPage extends Component<
  ReflectionPageProps,
  ReflectionPageState
> {
  constructor(props: ReflectionPageProps) {
    super(props);
    this.state = { reflectionText: '' };
  }

  setReflectionText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ reflectionText: e.target.value });
  };

  submitReflection = () => {
    Reflection.Create(
      this.props.room,
      this.props.user,
      this.state.reflectionText,
      reflection => {
        console.log(reflection.id);
      }
    );
  };

  render() {
    return (
      <div id="reflection-page">
        <h1 className="title">{this.props.room.activity.name}</h1>
        <h3>How did this practice make you feel?</h3>
        <textarea
          value={this.state.reflectionText}
          onChange={this.setReflectionText}
        ></textarea>
        <button onClick={this.submitReflection}>Submit reflection</button>
      </div>
    );
  }
}

import React, { Component } from 'react';
import { Room } from '../../storage/Room';
import { Reflection } from '../../storage/Reflection';
import { User } from '../../storage/User';
import './ReflectionPage.scss';

interface ReflectionFormProps {
  room: Room;
  user: User;
}

interface ReflectionFormState {
  reflectionText: string;
}

export class ReflectionForm extends Component<
  ReflectionFormProps,
  ReflectionFormState
> {
  constructor(props: ReflectionFormProps) {
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
      this.state.reflectionText
    );
  };

  render() {
    return (
      <div id="reflection-page">
        <h1 className="title title-padding">{this.props.room.activity.name}</h1>
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

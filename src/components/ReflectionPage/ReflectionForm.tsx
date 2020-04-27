import React, { Component } from 'react';
import { Room } from '../../storage/Room';
import { Reflection } from '../../storage/Reflection';
import { User } from '../../storage/User';

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
      <div id="reflection-form">
        <h1 className="title">{this.props.room.activity.name}</h1>
        <h3>How did this practice make you feel?</h3>
        <textarea
          value={this.state.reflectionText}
          onChange={this.setReflectionText}
        ></textarea>
        <button
          className="button"
          onClick={this.submitReflection}
          disabled={!this.state.reflectionText}
        >
          Submit reflection
        </button>
      </div>
    );
  }
}

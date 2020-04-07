import React, { Component } from 'react';
import { Room } from '../../storage/Room';

interface ReflectionPageProps {
  room: Room;
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

  render() {
    return (
      <div id="room-page">
        <h1 className="title">{this.props.room.activity.name}</h1>
        <h3>How did this practice make you feel?</h3>
        <textarea
          value={this.state.reflectionText}
          onChange={this.setReflectionText}
        ></textarea>
        <button>Submit reflection</button>
      </div>
    );
  }
}

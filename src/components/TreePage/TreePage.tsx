import React, { Component } from 'react'; // let's also import Component
import './TreePage.scss';
import { Link } from 'react-router-dom';

// the clock's state has one field: The current time, based upon the
// JavaScript class Date
interface TreePageState {
  time: Date;
}

// Clock has no properties, but the current state is of type ClockState
// The generic parameters in the Component typing allow to pass props
// and state. Since we don't have props, we pass an empty object.
export class TreePage extends Component<{}, TreePageState> {
  // The tick function sets the current state. TypeScript will let us know
  // which ones we are allowed to set.
  tick() {
    this.setState({
      time: new Date(),
    });
  }

  // Before the component mounts, we initialise our state
  componentWillMount() {
    this.tick();
  }

  // After the component did mount, we set the state each second.
  componentDidMount() {
    setInterval(() => this.tick(), 1000);
  }

  // render will know everything!
  render() {
    return (
      <div className="tree-page">
        <h1 className="title">
          This is the page with the tree and 5 big leaves.
        </h1>
        <Link to="/activities/gratitude">
          <button>Gratitude</button>
        </Link>
        <Link to="/activities/kindness">
          <button>Kindness</button>
        </Link>
        <Link to="/activities/compassion">
          <button>Compassion</button>
        </Link>
        <Link to="/activities/mindfulness">
          <button>Mindfulness</button>
        </Link>
        <Link to="/activities/resilience">
          <button>Resilience</button>
        </Link>
      </div>
    );
  }
}

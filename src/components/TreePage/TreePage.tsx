import React, { Component } from 'react'; // let's also import Component
import './TreePage.scss';
import { Link } from 'react-router-dom';

// the clock's state has one field: The current time, based upon the
// JavaScript class Date
interface TreePageState {
  time: Date;
}

export class TreePage extends Component<{}, TreePageState> {
  componentDidMount() {}

  render() {
    return (
      <div className="tree-page">
        <Link to="/activities/compassion" style={{ textDecoration: 'none' }}>
          <div className="card">
            <img className="tenet-image" src="../../images/tree.png" alt="" />
            <h3 className="tenet">Compassion</h3>
          </div>
        </Link>
        <Link to="/activities/gratitude" style={{ textDecoration: 'none' }}>
          <div className="card">
            <img className="tenet-image" src="../../images/tree.png" alt="" />
            <h3 className="tenet">Gratitude</h3>
          </div>
        </Link>
        <Link to="/activities/kindness" style={{ textDecoration: 'none' }}>
          <div className="card">
            <img className="tenet-image" src="../../images/tree.png" alt="" />
            <h3 className="tenet">Kindness</h3>
          </div>
        </Link>
        <Link to="/activities/mindfulness" style={{ textDecoration: 'none' }}>
          <div className="card">
            <img className="tenet-image" src="../../images/tree.png" alt="" />
            <h3 className="tenet">Mindfulness</h3>
          </div>
        </Link>
        <Link to="/activities/resilience" style={{ textDecoration: 'none' }}>
          <div className="card">
            <img className="tenet-image" src="../../images/tree.png" alt="" />
            <h3 className="tenet">Resilience</h3>
          </div>
        </Link>
      </div>
    );
  }
}

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
      <div id="tree-page">
        <h1 className="title">What will you grow today?</h1>
        <div className="card-container">
          <Link to="/activities/compassion" style={{ textDecoration: 'none' }}>
            <div className="card" id="compassion-card">
              <img className="card-image" src="../../images/tree.png" alt="" />
              <h3 className="card-title">Compassion</h3>
            </div>
          </Link>
          <Link to="/activities/gratitude" style={{ textDecoration: 'none' }}>
            <div className="card" id="gratitude-card">
              <img className="card-image" src="../../images/tree.png" alt="" />
              <h3 className="card-title">Gratitude</h3>
            </div>
          </Link>
          <Link to="/activities/kindness" style={{ textDecoration: 'none' }}>
            <div className="card" id="kindness-card">
              <img className="card-image" src="../../images/tree.png" alt="" />
              <h3 className="card-title">Kindness</h3>
            </div>
          </Link>
          <Link to="/activities/mindfulness" style={{ textDecoration: 'none' }}>
            <div className="card" id="mindfulness-card">
              <img className="card-image" src="../../images/tree.png" alt="" />
              <h3 className="card-title">Mindfulness</h3>
            </div>
          </Link>
          <Link to="/activities/resilience" style={{ textDecoration: 'none' }}>
            <div className="card" id="resilience-card">
              <img className="card-image" src="../../images/tree.png" alt="" />
              <h3 className="card-title">Resilience</h3>
            </div>
          </Link>
        </div>
      </div>
    );
  }
}

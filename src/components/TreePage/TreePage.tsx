import React, { Component } from 'react'; // let's also import Component
import './TreePage.scss';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRandom, faUser } from '@fortawesome/free-solid-svg-icons';

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
        <div className="title-container title-padding">
          <h1 className="title">What will you practice today?</h1>
          <div className="random-button-container">
            <FontAwesomeIcon
                  icon={faRandom}
                  // onClick={}
                  className="title random-button"
            ></FontAwesomeIcon>
            <span className="random-tooltip">
                  Choose a random activity!
            </span>
          </div>
        </div>
        <div className="card-container">
          <Link to="/activities/compassion" style={{ textDecoration: 'none' }}>
            <div className="card" id="compassion-card">
              <h3 className="card-title">Compassion</h3>
              <img
                className="card-image"
                src={require('../../images/avatars/compassion.png')}
                alt=""
              />
            </div>
          </Link>
          <Link to="/activities/gratitude" style={{ textDecoration: 'none' }}>
            <div className="card" id="gratitude-card">
              <h3 className="card-title">Gratitude</h3>
              <img
                className="card-image"
                src={require('../../images/avatars/gratitude.png')}
                alt=""
              />
            </div>
          </Link>
          <Link to="/activities/kindness" style={{ textDecoration: 'none' }}>
            <div className="card" id="kindness-card">
              <h3 className="card-title">Kindness</h3>
              <img
                className="card-image"
                src={require('../../images/avatars/kindness.png')}
                alt=""
              />
            </div>
          </Link>
          <Link to="/activities/mindfulness" style={{ textDecoration: 'none' }}>
            <div className="card" id="mindfulness-card">
              <h3 className="card-title">Mindfulness</h3>
              <img
                className="card-image"
                src={require('../../images/avatars/mindfulness.png')}
                alt=""
              />
            </div>
          </Link>
          <Link to="/activities/resilience" style={{ textDecoration: 'none' }}>
            <div className="card" id="resilience-card">
              <h3 className="card-title">Resilience</h3>
              <img
                className="card-image"
                src={require('../../images/avatars/resilience.png')}
                alt=""
              />
            </div>
          </Link>
        </div>
      </div>
    );
  }
}

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { LoadingPage } from '../LoadingPage/LoadingPage';
import './TreePage.scss';

interface TreePageState {
  imagesLoaded: number;
}

export class TreePage extends Component<{}, TreePageState> {
  state = {
    imagesLoaded: 0,
  };

  imageLoaded() {
    this.setState(prevState => {
      return { imagesLoaded: prevState.imagesLoaded + 1 };
    });
  }

  render() {
    return (
      <div id="tree-page">
        <div
          style={{ display: this.state.imagesLoaded === 5 ? 'none' : 'block' }}
        >
          <LoadingPage />
        </div>
        <h1 className="title">What will you practice today?</h1>
        <div className="card-container">
          <div className="card" id="compassion-card">
            <Link
              to="/activities/compassion"
              style={{ textDecoration: 'none' }}
            >
              <h3 className="card-title">Compassion</h3>
              <img
                className="card-image"
                src={require('../../images/avatars/compassion.png')}
                alt="compassion"
                onLoad={() => this.imageLoaded()}
              />
            </Link>
          </div>

          <div className="card" id="gratitude-card">
            <Link to="/activities/gratitude" style={{ textDecoration: 'none' }}>
              <h3 className="card-title">Gratitude</h3>
              <img
                className="card-image"
                src={require('../../images/avatars/gratitude.png')}
                alt="gratitude"
                onLoad={() => this.imageLoaded()}
              />
            </Link>
          </div>

          <div className="card" id="kindness-card">
            <Link to="/activities/kindness" style={{ textDecoration: 'none' }}>
              <h3 className="card-title">Kindness</h3>
              <img
                className="card-image"
                src={require('../../images/avatars/kindness.png')}
                alt="kindness"
                onLoad={() => this.imageLoaded()}
              />
            </Link>
          </div>

          <div className="card" id="mindfulness-card">
            <Link
              to="/activities/mindfulness"
              style={{ textDecoration: 'none' }}
            >
              <h3 className="card-title">Mindfulness</h3>
              <img
                className="card-image"
                src={require('../../images/avatars/mindfulness.png')}
                alt="mindfulness"
                onLoad={() => this.imageLoaded()}
              />
            </Link>
          </div>

          <div className="card" id="resilience-card">
            <Link
              to="/activities/resilience"
              style={{ textDecoration: 'none' }}
            >
              <h3 className="card-title">Resilience</h3>
              <img
                className="card-image"
                src={require('../../images/avatars/resilience.png')}
                alt="resilience"
                onLoad={() => this.imageLoaded()}
              />
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

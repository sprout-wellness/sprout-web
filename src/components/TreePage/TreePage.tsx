import React, { Component } from 'react'; // let's also import Component
import './TreePage.scss';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRandom, faUser } from '@fortawesome/free-solid-svg-icons';
import ActivitiesModal from '../ActivitiesModal/ActivitiesModal';

interface TreePageState {
  shouldShowRandomModel: boolean;
}

export class TreePage extends Component<{}, TreePageState> {

  state = {shouldShowRandomModel: false};

  componentDidMount() {}

  showRandomModal() {
    this.setState({ shouldShowRandomModel: true });
  }

  hideRandomModal() {
    this.setState({ shouldShowRandomModel: false });
  }

  render() {
    return (
      <div>
        <ActivitiesModal
          show={this.state.shouldShowRandomModel}
          handleClose={this.hideRandomModal.bind(this)}>
          <p>Modal</p>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        </ActivitiesModal>
        <div id="tree-page">
          <div className="title-container title-padding">
            <h1 className="title">What will you practice today?</h1>
            <div className="random-button-container">
              <FontAwesomeIcon
                    icon={faRandom}
                    onClick={this.showRandomModal.bind(this)}
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
      </div>
    );
  }
}

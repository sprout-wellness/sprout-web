import React, { Component } from 'react';
import { match, Redirect } from 'react-router-dom';
import { Activity } from '../../storage/Activity';
import { Room } from '../../storage/Room';
import './ActivityPage.scss';

interface DetailParams {
  tenet: string;
}

interface ActivityPageProps {
  match?: match<DetailParams>;
}

interface ActivityPageState {
  tenet: string;
  activities: Activity[];
  redirectToRoom: string;
}

export class ActivityPage extends Component<
  ActivityPageProps,
  ActivityPageState
> {
  constructor(props: ActivityPageProps) {
    super(props);

    // Getting wellness tenet from the url.
    const match = this.props.match;
    const currentTenet: string = match
      ? match.params.tenet
      : "This wellness tenet doesn't exist!";
    this.state = {
      tenet: currentTenet,
      activities: [],
      redirectToRoom: '',
    };
  }

  componentDidMount() {
    this.fetchActivities();
  }

  fetchActivities = async () => {
    const activities: Activity[] = await Activity.LoadActivitiesInTenet(
      this.state.tenet
    );
    this.setState({ activities });
  };

  createRoom = async (activity: Activity) => {
    const newRoomId = await Room.Create(activity);
    this.setState({
      redirectToRoom: newRoomId,
    });
  };

  capitalizeFirstLetter(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  render() {
    if (this.state.redirectToRoom) {
      return <Redirect to={`/room/${this.state.redirectToRoom}`} />;
    }
    return (
      <div id="activity-page">
        <h1 className="title">
          {this.capitalizeFirstLetter(this.state.tenet)}
        </h1>
        <div className="card-container tight">
          {this.state.activities.map((item, key) => {
            return (
              <div
                className="card large"
                key={key}
                onClick={this.createRoom.bind(this, item)}
              >
                <img
                  className="card-image"
                  src="../../images/tree.png"
                  alt=""
                />
                <h3 className="card-title">{item.name}</h3>
                <p className="card-content">{item.blurb}</p>
                <p className="card-subtitle">Duration: {item.time} minutes</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

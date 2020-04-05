import React, { Component } from "react";
import { match } from "react-router-dom";

interface DetailParams {
  tenet: string;
}

interface ActivityPageProps {
  match?: match<DetailParams>;
}

type ActivityPageState = {
  tenet: string;
};

export class ActivityPage extends Component<
  ActivityPageProps,
  ActivityPageState
> {
  constructor(props: ActivityPageProps) {
    super(props);

    // Getting wellness tenet from the url.
    const match = this.props.match;
    var currentTenet: string = match
      ? match.params.tenet
      : "This wellness tenet doesn't exist!";
    this.state = {
      tenet: currentTenet,
    };
  }

  componentDidMount() {}

  render() {
    return (
      <div>
        <h1>{this.state.tenet}</h1>
      </div>
    );
  }
}

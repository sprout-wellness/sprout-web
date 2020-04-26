import React, { FunctionComponent } from 'react';
import PropagateLoader from 'react-spinners/PropagateLoader';
import './LoadingPage.scss';

export const LoadingPage: FunctionComponent = () => (
  <div id="loading-page">
    <PropagateLoader size={20} color={'#64AF17'} loading={true} />
    Loading
  </div>
);

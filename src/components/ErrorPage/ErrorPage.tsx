import React, { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import './ErrorPage.scss';

interface ErrorPageProps {
  title: string;
  error?: string;
}

export const ErrorPage: FunctionComponent<ErrorPageProps> = ({
  title,
  error,
}: ErrorPageProps) => (
  <div id="error-page">
    <h1 className="title">{title}</h1>
    <p className="error">{error}</p>
    <Link to="/">
      <button className="button">Browse activities</button>
    </Link>
  </div>
);

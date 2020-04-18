import React, { Component } from 'react';
import './ActivitiesModal.scss';

interface ActivitiesModalProps {
  show: boolean;
  handleClose: any;  // TODO what is the type of a function lmao
  children: any;
}

const ActivitiesModal = (props: ActivitiesModalProps): JSX.Element => {
    const showHideClassName = props.show ? 'modal-background display-block' : 'modal-background display-none';
    return (
      <div className={showHideClassName}>
        <section className="modal-main">
          <div className="modal-guts">
            {props.children}
          </div>
          <button className="clickable" onClick={props.handleClose}>Close!</button>
        </section>
      </div>
    );
}

export default ActivitiesModal;
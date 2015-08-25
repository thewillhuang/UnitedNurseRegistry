'use strict';

import React from 'react';

export class ForHospitals extends React.Component {
  render() {
    return (
      <div>

        <div className='hospital-wrapper'>
          <div className='hospital-title'>
            <hr className='hospital-hr'></hr>
          </div>
        </div>

        <div className='grid2-items-lines'>
          <div href='#' className='grid2-item'>
            <i className='fa icon-paper-plane fa-2x grid2-i'></i>
            <h1>Post</h1>
            <p>Post a shift and specify your price range</p>
          </div>
          <div href='#' className='grid2-item'>
            <i className='fa icon-graph fa-2x grid2-i'></i>
            <h1>Real Time</h1>
            <p>Get real time Feedback from nurses around you. Accept the ones you want.</p>
          </div>
          <div href='#' className='grid2-item'>
            <i className='fa icon-credit-card fa-2x grid2-i'></i>
            <h1>Pay</h1>
            <p>Pay securely for the nurses's shift</p>
          </div>
        </div>

      </div>
    );
  }
}

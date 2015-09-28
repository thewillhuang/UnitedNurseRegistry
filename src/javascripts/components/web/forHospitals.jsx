

import React from 'react';

class ForHospitals extends React.Component {
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
            <p>Post shifts and specify your price</p>
          </div>
          <div href='#' className='grid2-item'>
            <i className='fa icon-graph fa-2x grid2-i'></i>
            <h1>Real Time</h1>
            <p>Immediate pricing Feedback from nurses around you. Accept the Bids from the nurses you want.</p>
          </div>
          <div href='#' className='grid2-item'>
            <i className='fa icon-credit-card fa-2x grid2-i'></i>
            <h1>Pay</h1>
            <p>Securely for the nurses's shift</p>
          </div>
          <div href='#' className='grid2-omega'>
          </div>
        </div>

      </div>
    );
  }
}

export default ForHospitals;

import React from 'react';

const ForHospitals = React.createClass({
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
            <i className='icon-paper-plane fa-2x grid2-i'></i>
            <h1>Request</h1>
            <p>Post shifts and specify your price</p>
          </div>
          <div href='#' className='grid2-item'>
            <i className='icon-energy fa-2x grid2-i'></i>
            <h1>Real Time</h1>
            <p>Get immediate pricing feedback from nurses around you.</p>
          </div>
          <div href='#' className='grid2-item'>
            <i className='icon-credit-card fa-2x grid2-i'></i>
            <h1>Save</h1>
            <p>We offer the most competitive bill rates.</p>
          </div>
          <div href='#' className='grid2-omega'>
          </div>
        </div>

      </div>
    );
  },
});

export default ForHospitals;

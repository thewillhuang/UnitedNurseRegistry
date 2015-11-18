import React from 'react';

const FeatureGrid = React.createClass({
  render() {
    return (
      <div>

        <div className='feature-wrapper'>
          <div className='feature-title'>
            <hr className='feature-hr'></hr>
          </div>
        </div>

        <div className='grid-items-lines'>
          <div href='#' className='grid-item'>
            <i className='fa icon-star fa-2x grid-i'></i>
            <h1>Review Nurses</h1>
            <p>Rate your nurses as well as view ratings before approving clinicians for a shift.</p>
          </div>
          <div href='#' className='grid-item'>
            <i className='fa icon-lock fa-2x grid-i'></i>
            <h1>Safe & Secure</h1>
            <p>AES-256 encrypted</p>
          </div>
          <div href='#' className='grid-item'>
            <i className='fa icon-reload fa-2x grid-i'></i>
            <h1>Rolling Payroll</h1>
            <p>Get paid on a two-day rolling basis</p>
          </div>
          <div href='#' className='grid-item'>
            <i className='fa icon-umbrella fa-2x grid-i'></i>
            <h1>Review Facilities</h1>
            <p>Rate facilities as well as view facility ratings before choosing your shifts</p>
          </div>
          <div href='#' className='grid-item'>
            <i className='fa icon-graph fa-2x grid-i'></i>
            <h1>Payments</h1>
            <p>Secure processing via Stripe</p>
          </div>
          <div href='#' className='grid-item'>
            <i className='fa icon-magnifier fa-2x grid-i'></i>
            <h1>Background Checked</h1>
            <p>Criminal records and backgrounds are checked using industry standards</p>
          </div>
          <div href='#' className='grid-omega'>
          </div>
      </div>

    </div>
    );
  },
});

export default FeatureGrid;



import React from 'react';

export default class FeatureGrid extends React.Component {
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
            <i className='fa icon-speedometer fa-2x grid-i'></i>
            <h1>Lighhting fast</h1>
            <p>Find a Match with your criteria in seconds.</p>
          </div>
          <div href='#' className='grid-item'>
            <i className='fa icon-lock fa-2x grid-i'></i>
            <h1>Safe & Secure</h1>
            <p>Everything is Military Grade Encrypted</p>
          </div>
          <div href='#' className='grid-item'>
            <i className='fa icon-reload fa-2x grid-i'></i>
            <h1>Rolling Payroll</h1>
            <p>Get paid on a 2 day rolling basis.</p>
          </div>
          <div href='#' className='grid-item'>
            <i className='fa icon-umbrella fa-2x grid-i'></i>
            <h1>Covered By Insurance</h1>
            <p>You will be paid, guaranteed.</p>
          </div>
          <div href='#' className='grid-item'>
            <i className='fa icon-graph fa-2x grid-i'></i>
            <h1>Simple Pricing</h1>
            <p>7% per successful shift. You keep the rest</p>
          </div>
          <div href='#' className='grid-item'>
            <i className='fa icon-magnifier fa-2x grid-i'></i>
            <h1>Background checked</h1>
            <p>All References are checked.</p>
          </div>
          <div href='#' className='grid-omega'>
          </div>
      </div>

    </div>
    );
  }
}

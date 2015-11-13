

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
            <h1>Review Nurses</h1>
            <p>Rate your nurses as well as view ratings before approving for a shift</p>
          </div>
          <div href='#' className='grid-item'>
            <i className='fa icon-lock fa-2x grid-i'></i>
            <h1>Safe & Secure</h1>
            <p>Everything is AES-256 Encrypted</p>
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
            <p>7% charge for successful shifts. You keep the rest</p>
          </div>
          <div href='#' className='grid-item'>
            <i className='fa icon-magnifier fa-2x grid-i'></i>
            <h1>Background checked</h1>
            <p>Criminal Record and Backgrounds are checked via industry standards.</p>
          </div>
          <div href='#' className='grid-omega'>
          </div>
      </div>

    </div>
    );
  }
}

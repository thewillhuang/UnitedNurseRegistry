'use strict';

import React from 'react';

export class FeatureGrid extends React.Component {
  render() {
    return (
      <div>

        <div className='feature-wrapper'>
          <div className='feature-title'>
            <hr className='feature-hr'></hr>
          </div>
        </div>

        <div className='grid-items-lines'>
          <a href='#' className='grid-item'>
            <i className='fa icon-energy fa-2x grid-i'></i>
            <h1>Lighhting fast</h1>
            <p>Find a Match with your criteria in seconds.</p>
          </a>
          <a href='#' className='grid-item'>
            <i className='fa icon-lock fa-2x grid-i'></i>
            <h1>Safe & Secure</h1>
            <p>Everything is Military Grade Encrypted</p>
          </a>
          <a href='#' className='grid-item'>
            <i className='fa icon-reload fa-2x grid-i'></i>
            <h1>Recurring Payroll</h1>
            <p>You Choose how you get paid.</p>
          </a>
          <a href='#' className='grid-item'>
            <i className='fa icon-umbrella fa-2x grid-i'></i>
            <h1>Covered By Insurence</h1>
            <p>You will be paid, guaranteed.</p>
          </a>
          <a href='#' className='grid-item'>
            <i className='fa icon-screen-smartphone fa-2x grid-i'></i>
            <h1>Mobile Apps</h1>
            <p>Control your everything from your mobile device.</p>
          </a>
          <a href='#' className='grid-item'>
            <i className='fa icon-like fa-2x grid-i'></i>
            <h1>Background checked</h1>
            <p>All References are checked.</p>
          </a>
        <div className='right-cover'></div>
        <div className='bottom-cover'></div>
      </div>

    </div>
    );
  }
}

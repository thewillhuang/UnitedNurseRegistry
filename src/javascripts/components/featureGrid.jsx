'use strict';

import React from 'react';

export class FeatureGrid extends React.Component {
      // <div className='grid-items'>
      //   <a href='javascript:void(0)' className='grid-item'>
      //     <img src='https://raw.githubusercontent.com/thoughtbot/refills/master/source/images/placeholder_logo_1.png' alt />
      //     <h1>Grid Item</h1>
      //     <p>Lorem ipsum dolor sit amet, elit. Rem, illum.</p>
      //   </a>
      //   <a href='javascript:void(0)' className='grid-item grid-item-big grid-item-image'>
      //     <img src='https://raw.githubusercontent.com/thoughtbot/refills/master/source/images/placeholder_logo_2.png' alt />
      //     <h1>Grid Item With an Image</h1>
      //     <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Rem, illum.</p>
      //   </a>
      //   <a href='javascript:void(0)' className='grid-item grid-item-big'>
      //     <img src='https://raw.githubusercontent.com/thoughtbot/refills/master/source/images/placeholder_logo_3.png' alt />
      //     <h1>Another Wide Item</h1>
      //     <p>Lorem ipsum consectetur dolor sit amet, consectetur adipisicing elit. Rem, illum.</p>
      //   </a>
      //   <a href='javascript:void(0)' className='grid-item'>
      //     <img src='https://raw.githubusercontent.com/thoughtbot/refills/master/source/images/placeholder_logo_2.png' alt />
      //     <h1>Last Grid Item</h1>
      //     <p>Lorem ipsum dolor sit amet, elit. Rem, illum.</p>
      //   </a>
      //   <a href='javascript:void(0)' className='grid-item'>
      //     <img src='https://raw.githubusercontent.com/thoughtbot/refills/master/source/images/placeholder_logo_2.png' alt />
      //     <h1>Last Grid Item</h1>
      //     <p>Lorem ipsum dolor sit amet, elit. Rem, illum.</p>
      //   </a>
      //   <a href='javascript:void(0)' className='grid-item'>
      //     <img src='https://raw.githubusercontent.com/thoughtbot/refills/master/source/images/placeholder_logo_3.png' alt />
      //     <h1>A Grid Item</h1>
      //     <p>Lorem ipsum dolor sit amet, elit. Rem, illum.</p>
      //   </a>
      //   <a href='javascript:void(0)' className='grid-item'>
      //     <img src='https://raw.githubusercontent.com/thoughtbot/refills/master/source/images/placeholder_logo_1.png' alt />
      //     <h1>Item</h1>
      //     <p>Lorem ipsum dolor sit amet, elit. Rem, illum.</p>
      //   </a>
      // </div>
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

'use strict';

import React from 'react';
import mui from 'material-ui';
const ThemeManager = new mui.Styles.ThemeManager();

export class Footer extends React.Component {
  static childContextTypes = {
    muiTheme: React.PropTypes.object,
  }
  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme(),
    };
  }
  render() {
    return (
      <footer className='footer-2' role='contentinfo'>
        <div className='footer-logo'>
          <img alt='Logo image' src='../../images/sourcefusion-transparent.png'/>
        </div>
        <ul>
          <li>
            <a href=''>About</a>
          </li>
          <li>
            <a href=''>Contact</a>
          </li>
          <li>
            <a href=''>Products</a>
          </li>
        </ul>
        <div className='footer-secondary-links'>
          <ul>
            <li>
              <a href=''>Terms and Conditions</a>
            </li>
            <li>
              <a href=''>Privacy Policy</a>
            </li>
          </ul>
          <ul className='footer-social'>
            <li>
              <a href=''>
                <img alt='Facebook' src='https://raw.githubusercontent.com/thoughtbot/refills/master/source/images/facebook-logo-circle.png'/>
              </a>
            </li>
            <li>
              <a href=''>
                <img alt='Twitter' src='https://raw.githubusercontent.com/thoughtbot/refills/master/source/images/twitter-logo-circle.png'/>
              </a>
            </li>
            <li>
              <a href=''>
                <img alt='YouTube' src='https://raw.githubusercontent.com/thoughtbot/refills/master/source/images/youtube-logo-circle.png'/>
              </a>
            </li>
          </ul>
        </div>
      </footer>
    );
  }
}

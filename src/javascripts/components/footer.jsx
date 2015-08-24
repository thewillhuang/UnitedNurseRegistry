'use strict';

import React from 'react';
import mui, { FontIcon } from 'material-ui';
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
                <FontIcon className='fa fa-facebook-official' hoverColor={'#FFFFFF'} color={'light-grey'}/>
              </a>
            </li>
            <li>
              <a href=''>
                <FontIcon className='fa fa-twitter-square' hoverColor={'#FFFFFF'} color={'light-grey'}/>
              </a>
            </li>
            <li>
              <a href=''>
                <FontIcon className='fa fa-google-plus-square' hoverColor={'#FFFFFF'} color={'light-grey'}/>
              </a>
            </li>
          </ul>
        </div>
      </footer>
    );
  }
}

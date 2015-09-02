'use strict';

import React from 'react';
import mui, { FontIcon } from 'material-ui';
// const MenuItem = require('material-ui/lib/menus/menu-item');
// const MenuDivider = require('material-ui/lib/menus/menu-divider');
const ThemeManager = new mui.Styles.ThemeManager();
// import MediaQuery from 'react-responsive';

class AppNavBar extends React.Component {
  state = {
    userName: 'User',
  }

  static childContextTypes = {
    muiTheme: React.PropTypes.object,
  }

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme(),
    };
  }

  componentDidMount() {

  }

  render() {
    return (
      <div className='appNavBar'>
        <ul className='appNavMenu'>
          <li>
            <FontIcon
              color='rgb(199, 199, 199)'
              className='icon-briefcase'/>
            <a href='#/app/shifts'>
              Shifts
            </a>
          </li>
          <li>
            <FontIcon
              color='rgb(199, 199, 199)'
              className='icon-check'/>
            <a href='#/app/todo'>
              TODOs
            </a>
          </li>
          <li>
            <FontIcon
              color='rgb(199, 199, 199)'
              className='icon-user'/>
            <a href='#/app/profile'>
              Profile
            </a>
          </li>
          <li>
            <FontIcon
              color='rgb(199, 199, 199)'
              className='icon-graph'/>
            <a href='#/app/balance'>
              Balance
            </a>
          </li>
          <li>
            <FontIcon
              color='rgb(199, 199, 199)'
              className='icon-star'/>
            <a href='#/app/reviews'>
              Reviews
            </a>
          </li>
          <li>
            <FontIcon
              color='rgb(199, 199, 199)'
              className='icon-heart'/>
            <a href='#/app/referrals'>
              Referrals
            </a>
          </li>
        </ul>
      </div>
    );
  }
}

export default AppNavBar;

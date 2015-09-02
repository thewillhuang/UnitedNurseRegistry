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
              className='icon-rocket'/>
            <a href='default.asp'>
              Home
            </a>
          </li>
          <li><a href='news.asp'>News</a></li>
          <li><a href='contact.asp'>Contact</a></li>
          <li><a href='about.asp'>About</a></li>
        </ul>
      </div>
    );
  }
}

export default AppNavBar;

'use strict';

import React from 'react';
import mui, {IconMenu, IconButton} from 'material-ui';
const MenuItem = require('material-ui/lib/menus/menu-item');
// const MenuDivider = require('material-ui/lib/menus/menu-divider');
const ThemeManager = new mui.Styles.ThemeManager();
// import MediaQuery from 'react-responsive';

class AppBar extends React.Component {
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
      <div className='appBar'>
        <div className='appBarUser'>
          <div className='appUserWrap'>
            <div className='appUserPhoto'>
              <img src='../../../images/sourcefusion-final.jpg'/>
            </div>
            <div className='appUserName'>
              {this.state.userName}
            </div>
          </div>
        </div>
        <div className='appBarMenuButton'>
          <IconMenu
            openDirection='bottom-left'
            iconButtonElement={
              <IconButton
                style={{color: 'rgb(180, 180, 180)'}}
                iconClassName='icon-menu'
                tooltip='menu'/>
            }
            >
            <MenuItem
              primaryText='Logout'/>
          </IconMenu>
        </div>
        <div className='appBarTitle'>
          <p>United Nurse Registry</p>
        </div>
      </div>
    );
  }
}

export default AppBar;

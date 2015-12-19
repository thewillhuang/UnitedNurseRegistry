

import React from 'react';
import { IconMenu, IconButton } from 'material-ui';
const MenuItem = require('material-ui/lib/menus/menu-item');

const AppBar = React.createClass({
  getInitialState() {
    return {
      userName: 'User First Name',
    };
  },

  componentWillUnmount() {
    window.sessionStorage.clear();
  },

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
                style={{ color: 'rgb(180, 180, 180)' }}
                iconClassName='icon-menu'
                tooltip='menu'
              />
            }
          >
            <MenuItem
              onClick={() => {window.location.assign('/'); }}
              primaryText='Logout'
            />
          </IconMenu>
        </div>
        <div className='appBarTitle'>
          <a href='#/app/shifts'>
            <p>Nurse Dashboard</p>
          </a>
        </div>
      </div>
    );
  },
});

export default AppBar;

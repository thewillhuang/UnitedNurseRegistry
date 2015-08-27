'use strict';

import React from 'react';
import mui, { Toolbar, ToolbarGroup, RaisedButton, AppBar, IconMenu, IconButton, FlatButton } from 'material-ui';
const MenuItem = require('material-ui/lib/menus/menu-item');
const MenuDivider = require('material-ui/lib/menus/menu-divider');
const ThemeManager = new mui.Styles.ThemeManager();
import MediaQuery from 'react-responsive';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

class HomeToolBar extends React.Component {
  static childContextTypes = {
    muiTheme: React.PropTypes.object,
  }
  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme(),
    };
  }
  onMenuTap(value) {
    switch (value) {
    case 'login':
      window.location.assign('/#/login');
      break;
    case 'signup':
      window.location.assign('/#/signup');
      break;
    case 'hospitals':
      window.location.assign('/#/hospitals');
      break;
    case 'home':
      window.location.assign('/#/home');
      break;
    default:
      return false;
    }
  }
  render() {
    return (
      <div>
        <MediaQuery minWidth={755}>
        <Toolbar style={{
          backgroundColor: 'rbga(255,255,255,0.6)',
          paddingTop: 20,
          marginBottom: 20,
        }}>
          <ToolbarGroup float='left' key={0}>
            <RaisedButton href='#home' label='united nurse registry' linkButton={true} primary={true}/>
          </ToolbarGroup>
          <ToolbarGroup float='right' key={1}>
            <FlatButton href='#hospitals' label='Hospitals' linkButton={true} secondary={true} style={{
              backgroundColor: 'rbga(255,255,255,0.6)',
              color: 'white',
            }}
            />
            <FlatButton href='#login' label='Login' linkButton={true} secondary={true} style={{
              backgroundColor: 'rbga(255,255,255,0.6)',
              color: 'white',
            }}/>
            <FlatButton href='#signup' label='Sign up' linkButton={true} secondary={true} style={{
              backgroundColor: 'rbga(255,255,255,0.6)',
              color: 'white',
            }}/>
          </ToolbarGroup>
        </Toolbar>
        </MediaQuery>
        <MediaQuery maxWidth={755}>
          <AppBar
            style={{
              backgroundColor: 'rbga(255,255,255,0.6)',
              paddingTop: 5,
              marginBottom: 20,
            }}
            showMenuIconButton={false}
            iconElementRight={
            <IconMenu iconButtonElement={
                <IconButton iconClassName='fa fa-bars' tooltip='Menu'/>
              }>
              <MenuItem onClick={() => {this.onMenuTap('home'); }} primaryText='Home' />
              <MenuDivider/>
              <MenuItem onClick={() => {this.onMenuTap('login'); }} primaryText='Login' />
              <MenuItem onClick={() => {this.onMenuTap('signup'); }} primaryText='Sign up' />
              <MenuItem onClick={() => {this.onMenuTap('hospitals'); }} primaryText='Hospitals'/ >
            </IconMenu>
            } title='Dream Crew'/>
        </MediaQuery>
      </div>
    );
  }
}

export default HomeToolBar;

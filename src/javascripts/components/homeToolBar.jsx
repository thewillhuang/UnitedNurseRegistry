'use strict';

import React from 'react';
import mui,
{
  Toolbar,
  ToolbarGroup,
  RaisedButton,
  AppBar,
  IconMenu,
  IconButton,
} from 'material-ui';
const MenuItem = require('material-ui/lib/menus/menu-item');
const MenuDivider = require('material-ui/lib/menus/menu-divider');
const ThemeManager = new mui.Styles.ThemeManager();
import MediaQuery from 'react-responsive';

export class HomeToolBar extends React.Component {
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
      <div>
        <MediaQuery minWidth={514}>
        <Toolbar style={{
          backgroundColor: 'rbga(255,255,255,0.6)',
          paddingTop: 20,
          marginBottom: 20,
        }}>
          <ToolbarGroup float='left' key={0}>
            <RaisedButton href='#home' label='Dream Crew' linkButton={true} primary={true}/>
          </ToolbarGroup>
          <ToolbarGroup float='right' key={1}>
            <RaisedButton href='#signup' label='Signup' linkButton={true} secondary={true}/>
            <RaisedButton href='#login' label='Login' linkButton={true} primary={true}/>
          </ToolbarGroup>
        </Toolbar>
        </MediaQuery>
        <MediaQuery maxWidth={514}>
          <AppBar
            showMenuIconButton={false}
            iconElementRight={
            <IconMenu iconButtonElement={
                <IconButton iconClassName='fa fa-bars' tooltip='Menu'/>
              }>
              <MenuItem primaryText='Login' />
              <MenuItem primaryText='Signup' />
              <MenuItem primaryText='Hospitals' />
              <MenuDivider/>
              <MenuItem primaryText='Home' />
            </IconMenu>
            } title='Dream Crew'/>
        </MediaQuery>
      </div>
    );
  }
}

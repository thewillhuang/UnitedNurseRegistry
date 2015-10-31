

import React from 'react';
import { Toolbar, ToolbarGroup, RaisedButton, AppBar, IconMenu, IconButton, FlatButton } from 'material-ui';
const MenuItem = require('material-ui/lib/menus/menu-item');
const MenuDivider = require('material-ui/lib/menus/menu-divider');
// // const ThemeManager = new mui.Styles.ThemeManager();
import MediaQuery from 'react-responsive';

class HomeToolBar extends React.Component {
  static childContextTypes = {
    muiTheme: React.PropTypes.object,
  }
  // getChildContext() {
  //   return {
  //     muiTheme: ThemeManager.getCurrentTheme(),
  //   };
  // }
  render() {
    return (
      <div>
        <MediaQuery minWidth={909}>
        <Toolbar style={{
          backgroundColor: 'rbga(255,255,255,0.6)',
          paddingTop: 20,
          marginBottom: 20,
        }}>
          <ToolbarGroup float='left' key={0}>
            <RaisedButton href='#home' label='united nurse registry' linkButton primary/>
          </ToolbarGroup>
          <ToolbarGroup float='right' key={1}>
            <FlatButton href='#hospitalSignup' label='Hospital Signup' linkButton secondary style={{
              backgroundColor: 'rbga(255,255,255,0.6)',
              color: 'white',
              marginLeft: 10,
              marginRight: 10,
            }}
            />
            <FlatButton href='#hospitallogin' label='Hospital Login' linkButton secondary style={{
              backgroundColor: 'rbga(255,255,255,0.6)',
              color: 'white',
              marginLeft: 10,
              marginRight: 10,
            }}
            />
            <FlatButton href='#signup' label='User Sign up' linkButton secondary style={{
              backgroundColor: 'rbga(255,255,255,0.6)',
              color: 'white',
              marginLeft: 10,
              marginRight: 10,
            }}/>
            <FlatButton href='#login' label='User Login' linkButton secondary style={{
              backgroundColor: 'rbga(255,255,255,0.6)',
              color: 'white',
              marginLeft: 29,
              marginRight: 10,
            }}/>
          </ToolbarGroup>
        </Toolbar>
        </MediaQuery>
        <MediaQuery maxWidth={909}>
          <AppBar
            style={{
              paddingTop: 5,
              marginBottom: 20,
            }}
            showMenuIconButton={false}
            iconElementRight={
            <IconMenu iconButtonElement={
                <IconButton iconClassName='fa fa-bars' tooltip='Menu'/>
              }>
              <MenuItem onClick={()=> {window.location.assign('/'); }} primaryText='Home' />
              <MenuDivider/>
              <MenuItem onClick={()=> {window.location.assign('/#/hospitallogin'); }} primaryText='Hospital Login'/ >
              <MenuItem onClick={()=> {window.location.assign('/#/hospitalsignup'); }} primaryText='Hospital Signup'/ >
              <MenuItem onClick={()=> {window.location.assign('/#/signup'); }} primaryText='User Sign up' />
              <MenuItem onClick={()=> {window.location.assign('/#/login'); }} primaryText='User Login' />
            </IconMenu>
          } title='United Nurse Registry'/>
        </MediaQuery>
      </div>
    );
  }
}

export default HomeToolBar;

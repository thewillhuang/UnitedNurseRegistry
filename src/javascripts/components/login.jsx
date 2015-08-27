'use strict';

import React from 'react';
import mui from 'material-ui';
import HomeToolBar from './homeToolBar.jsx';
import LoginBox from './loginBox.jsx';
import Footer from './footer.jsx';
const ThemeManager = new mui.Styles.ThemeManager();

class Login extends React.Component {
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
        <div className='loginAlpha'>
          <HomeToolBar/>
          <div className='spacing' />
          <div className='signup-wrap'>
            <h3 style={{color: 'white', textAlign: 'center'}}>Login</h3>
            <LoginBox />
          </div>
        </div>
        <Footer/>
      </div>
    );
  }
}

export default Login;

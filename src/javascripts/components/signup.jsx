'use strict';

import React from 'react';
import mui from 'material-ui';
import HomeToolBar from './homeToolBar.jsx';
import SignupBox from './signupBox.jsx';
import Footer from './footer.jsx';
const ThemeManager = new mui.Styles.ThemeManager();

class Signup extends React.Component {
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
        <div className='signupAlpha'>
          <HomeToolBar/>
          <div className='spacing' />
          <div className='signup-wrap'>
            <h3 style={{color: 'white', textAlign: 'center'}}>Sign up</h3>
            <SignupBox />
          </div>
        </div>
        <Footer/>
      </div>
    );
  }
}

export default Signup;

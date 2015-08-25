'use strict';

import React from 'react';
import mui from 'material-ui';
import HomeToolBar from './homeToolBar.jsx';
import Footer from './footer.jsx';
import FeatureGrid from './featureGrid.jsx';
import SignupBox from './signupBox.jsx';
import ForNurses from './forNurses.jsx';
import ForHospitals from './forHospitals.jsx';
const ThemeManager = new mui.Styles.ThemeManager();

export class Home extends React.Component {
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

        <div className='alpha'>
          <HomeToolBar/>
          <div className='beta'>

            <div className='slogan'>
              <h1>
                The Best place to find on demand shifts from the hospital.
              </h1>
            </div>

            <div className='home-signup'>
              <h3>
                Signup
              </h3>
              <SignupBox />
            </div>

          </div>

        </div>
        <ForNurses />
        <ForHospitals />
        <FeatureGrid />
        <Footer/>
      </div>
    );
  }
}

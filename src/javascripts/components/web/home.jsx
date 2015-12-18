

import React from 'react';
// // import mui from 'material-ui';
import HomeToolBar from './homeToolBar.jsx';
import Footer from './footer.jsx';
import FeatureGrid from './featureGrid.jsx';
import SignupBeta from './signupBeta.jsx';
import ForNurses from './forNurses.jsx';
import ForHospitals from './forHospitals.jsx';
import ForReferrals from './forReferrals.jsx';

// // const ThemeManager = new mui.Styles.ThemeManager();

const Home = React.createClass({
  render() {
    return (
      <div>
        <div className='alpha'>
          <HomeToolBar/>
          <div className='beta'>

            <div className='slogan'>
              <h1>
                The best place to find on demand shifts from the hospital.
              </h1>
            </div>

            <div className='home-signup'>
              <SignupBeta />
            </div>

          </div>

        </div>
        <ForHospitals />
        <ForNurses />
        <FeatureGrid />
        <ForReferrals />
        <Footer/>
      </div>
    );
  },
});

export default Home;

import React from 'react';
// // import mui from 'material-ui';
import HomeToolBar from './homeToolBar.jsx';
import HospitalLoginBox from './hospitalLoginBox.jsx';
import Footer from './footer.jsx';
// // const ThemeManager = new mui.Styles.ThemeManager();

class Hospital extends React.Component {
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
        <div className='hospitalAlpha'>
          <HomeToolBar/>
          <div className='spacing' />
          <div className='signup-wrap'>
            <h3 style={{color: 'white', textAlign: 'center'}}>Hospital Login</h3>
            <HospitalLoginBox />
          </div>
        </div>
        <Footer/>
      </div>
    );
  }
}

export default Hospital;

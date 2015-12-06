import React from 'react';
import HomeToolBar from './homeToolBar.jsx';
import HospitalLoginBox from './hospitalLoginBox.jsx';
import Footer from './footer.jsx';

const Hospital = React.createClass({

  render: function () {
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
  },
});

export default Hospital;

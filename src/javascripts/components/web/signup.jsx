import React from 'react';
import HomeToolBar from './homeToolBar.jsx';
import SignupBox from './signupBox.jsx';
import Footer from './footer.jsx';

const Signup = React.createClass({

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
  },
});

export default Signup;

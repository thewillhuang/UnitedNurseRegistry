import React from 'react';
import HomeToolBar from './homeToolBar.jsx';
import LoginBox from './loginBox.jsx';
import Footer from './footer.jsx';

const Login = React.createClass({

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
  },
});

export default Login;

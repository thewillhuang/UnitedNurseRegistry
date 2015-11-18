import React from 'react';
import AppBar from '../app/appToolBar.jsx';
import AppNavBar from '../app/appLeftNavBar.jsx';

const App = React.createClass({

  propTypes: {
    children: React.PropTypes.node,
  },

  componentDidMount() {
    this.checkToken();
  },

  checkToken() {
    if (sessionStorage.length) {
      window.location.assign('#/app/shifts');
    } else {
      window.location.assign('/');
    }
  },

  render() {
    return (
      <div>
        <AppBar />
        <AppNavBar />
        <div className='appBody'>
          <div className='appContent'>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  },
});

export default App;

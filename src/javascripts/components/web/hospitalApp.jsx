import React from 'react';
import AppBar from '../hospital/appToolBar.jsx';
import AppNavBar from '../hospital/appLeftNavBar.jsx';

const Hospital = React.createClass({

  propTypes: {
    children: React.PropTypes.node,
  },

  componentDidMount() {
    this.checkToken();
  },

  checkToken() {
    if (sessionStorage.length) {
      window.location.assign('#/hospital/shifts');
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

export default Hospital;

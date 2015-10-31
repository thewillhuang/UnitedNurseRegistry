import React from 'react';
// // import mui from 'material-ui';
import AppBar from '../hospital/appToolBar.jsx';
import AppNavBar from '../hospital/appLeftNavBar.jsx';
// // const ThemeManager = new mui.Styles.ThemeManager();

class Hospital extends React.Component {
  static childContextTypes = {
    muiTheme: React.PropTypes.object,
  }

  static propTypes = {
    children: React.PropTypes.node,
  }

  // getChildContext() {
  //   return {
  //     muiTheme: ThemeManager.getCurrentTheme(),
  //   };
  // }

  componentDidMount() {
    this.checkToken();
  }

  checkToken = () => {
    if (sessionStorage.length) {
      window.location.assign('#/hospital/shifts');
    } else {
      window.location.assign('/');
    }
  };

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
  }
}

export default Hospital;

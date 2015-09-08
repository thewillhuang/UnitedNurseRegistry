

import React from 'react';
import mui from 'material-ui';
import AppBar from '../app/appToolBar.jsx';
import AppNavBar from '../app/appLeftNavBar.jsx';
const ThemeManager = new mui.Styles.ThemeManager();

class App extends React.Component {
  static childContextTypes = {
    muiTheme: React.PropTypes.object,
  }

  static propTypes = {
    children: React.PropTypes.node,
  }

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme(),
    };
  }

  componentDidMount() {
    this.checkToken();
  }

  checkToken = () => {
    if (sessionStorage.length) {
      window.location.assign('#/app/shifts');
    } else {
      window.location.assign('#/home');
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

export default App;

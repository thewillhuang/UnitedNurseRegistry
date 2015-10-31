import React from 'react';
// import mui from 'material-ui';
import PostShifts from './postShifts.jsx';
import ShiftFeedback from './shiftFeedback.jsx';
// const ThemeManager = new mui.Styles.ThemeManager();
// const MenuItem = require('material-ui/lib/menus/menu-item');
// const MenuDivider = require('material-ui/lib/menus/menu-divider');
// import MediaQuery from 'react-responsive';

class Shift extends React.Component {
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
      <div className='hospitalShifts'>
        <div className='postShifts'>
          <div className='card'>
            <div className='cardTitle'>
              Post Shifts
            </div>
            <hr className='cardDivider' />
            <div className='cardBody'>
              <PostShifts />
            </div>
          </div>
        </div>
        <div className='shiftFeedback'>
          <div className='card'>
            <div className='cardTitle'>
              Feedbacks
            </div>
            <hr className='cardDivider' />
            <div className='cardBody'>
              <ShiftFeedback />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Shift;

import React from 'react';
import mui, {TextField} from 'material-ui';
const ThemeManager = new mui.Styles.ThemeManager();

class WorkHistoryCard extends React.Component {
  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme(),
    };
  }

  static childContextTypes = {
    muiTheme: React.PropTypes.object,
  }

  render() {
    return (
      <div className='card'>
        <div className='cardTitle'>
          Work History
        </div>
        <hr className='cardDivider' />
        <div className='cardBody'>
          <TextField
            ref='facilityName'
            floatingLabelText='Facility Name'
            hintText='Facility Name' />
          <br/>
          <TextField
            ref='duration'
            floatingLabelText='Duration'
            hintText='Duration' />
          <br/>
          <TextField
            ref='reference'
            floatingLabelText='Reference Name'
            hintText='Reference Name' />
          <br/>
          <TextField
            ref='reference phone'
            floatingLabelText='Reference Phone'
            hintText='Reference Phone' />
        </div>
      </div>
    );
  }
}

export default WorkHistoryCard;

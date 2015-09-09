import React from 'react';
import mui, {TextField, RaisedButton} from 'material-ui';
const ThemeManager = new mui.Styles.ThemeManager();
const input = {
  cursor: 'pointer',
  position: 'absolute',
  top: 0,
  bottom: 0,
  right: 0,
  left: 0,
  width: '100%',
  opacity: 0,
};

class ProfileCard extends React.Component {
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
          Profile
        </div>
        <hr className='cardDivider' />
        <div className='cardBody'>
          <div className='profileCardInputWrap'>
            <TextField
              ref='name'
              floatingLabelText='Hospital Name'
              hintText='Name' />
            <RaisedButton primary={true} label='Upload Facility Images'>
              <input type='file' style={input}></input>
            </RaisedButton>
            <br/>
            <TextField
              ref='emr'
              floatingLabelText='Hospital EMR'
              hintText='EMR' />
            <br/>
            <TextField
              ref='dress'
              floatingLabelText='Dress Code'
              hintText='Dress Code' />
            <br/>
            <TextField
              ref='phone'
              floatingLabelText='Phone Number'
              hintText='Phone Number' />
            <br/>
            <TextField
              ref='address'
              floatingLabelText='Address'
              hintText='Address' />
          </div>
        </div>
      </div>
    );
  }
}

export default ProfileCard;

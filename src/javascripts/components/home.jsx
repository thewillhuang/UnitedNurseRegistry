'use strict';

import React from 'react';
import mui, {Card, TextField, CardActions, RaisedButton, CardText } from 'material-ui';
import { HomeToolBar } from './homeToolBar.jsx';
import { Footer } from './footer.jsx';
const ThemeManager = new mui.Styles.ThemeManager();

export class Home extends React.Component {
  static childContextTypes = {
    muiTheme: React.PropTypes.object,
  }
  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme(),
    };
  }
  render() {
    return (
      <div>
        <div className='alpha'>
          <HomeToolBar/>
          <div className='beta'>
            <div className='slogan'>
              <h1>
                The Best place to find on-demand shifts from the hospital.
              </h1>
            </div>
            <div className='home-signup'>
              <h3>
                Signup
              </h3>
              <Card>
                <div className='signup-wrapper'>
                  <TextField floatingLabelText='Email Address' hintText='Email'/>
                  <TextField floatingLabelText='Password' hintText='Password' type='password'/>
                  <CardActions>
                    <div className='signupbutton'>
                      <RaisedButton label='Signup' secondary={true}/>
                    </div>
                  </CardActions>
                </div>
              </Card>
            </div>
          </div>
        </div>
        <Card>
          <CardText>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi. Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque. Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
          </CardText>
        </Card>
        <Footer/>
      </div>
    );
  }
}

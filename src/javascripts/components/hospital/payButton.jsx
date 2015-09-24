import React from 'react';
import mui, {RaisedButton} from 'material-ui';
const ThemeManager = new mui.Styles.ThemeManager();

class Checkout extends React.Component {
  static childContextTypes = {
    muiTheme: React.PropTypes.object,
  }

  static propTypes = {
    children: React.PropTypes.node,
    pay: React.PropTypes.number.isRequired,
  }

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme(),
    };
  }

  createToken = () => {
    const handler = window.StripeCheckout.configure({
      key: 'pk_test_pUdeTIh8WRLykG3RSugGr5yg',
      locale: 'auto',
      token: function(token) {
        console.log(token);
      },
    });

    handler.open({
      name: 'test',
      description: '2 widgets',
      amount: this.props.pay * 100,
    });
  }

  render() {
    return (
      <div>
        <RaisedButton secondary label='Pay' onClick={this.createToken} />
      </div>
    );
  }
}

export default Checkout;

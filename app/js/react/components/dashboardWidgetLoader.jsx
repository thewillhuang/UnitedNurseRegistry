'use strict';
var React = require('react');
var CircleOfTrustListBox = require('./circleOfTrustListBox.jsx');
var NotificationBell = require('./notificationBell.jsx');

React.render(<NotificationBell />, document.getElementById('reactNavItems'));

React.render(<CircleOfTrustListBox />, document.getElementById('reactCircleOfTrust'));

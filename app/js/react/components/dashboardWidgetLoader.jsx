'use strict';
const React = require('react');
const CircleOfTrustListBox = require('./circleOfTrustListBox.jsx');
const NotificationBell = require('./notificationBell.jsx');

React.render(<NotificationBell />, document.getElementById('reactNavItems'));

React.render(<CircleOfTrustListBox />, document.getElementById('reactCircleOfTrust'));

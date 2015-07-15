'use strict';
const React = require('react');
const CircleOfTrustListBox = require('./circleOfTrustListBox.jsx');
const NotificationBell = require('./notificationBell.jsx');
const MessengingBubble = require('./messageNotification.jsx');
console.log('random test to see if sorcemaps work');
React.render(<NotificationBell />, document.getElementById('reactNavItems'));

React.render(<MessengingBubble />, document.getElementById('messenging'));

React.render(<CircleOfTrustListBox />, document.getElementById('reactCircleOfTrust'));

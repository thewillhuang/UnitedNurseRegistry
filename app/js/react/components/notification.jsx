'use strict';

const React = require('react');
const NotificationBell = require('./notificationBell.jsx');
const MessageNotification = require('./messageNotification.jsx');

React.render(<MessageNotification />, document.getElementById('messenging'));

React.render(<NotificationBell />, document.getElementById('reactNavItems'));

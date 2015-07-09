const React = require('react');
const View = require('./clientValidateView.jsx');
// let MdInfo = require('./mdInfo.jsx');
const NotificationBell = require('./notificationBell.jsx');
const MessageNotification = require('./messageNotification.jsx');

React.render(<MessageNotification />, document.getElementById('messenging'));
React.render(<NotificationBell />, document.getElementById('reactNavItems'));
React.render(<View />, document.getElementById('view'));

// React.render(<MdInfo />, document.getElementById('mdInfo'));

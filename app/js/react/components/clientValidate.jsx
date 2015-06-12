var React = require('react');
var View = require('./clientValidateView.jsx');
// var MdInfo = require('./mdInfo.jsx');
var NotificationBell = require('./notificationBell.jsx');

React.render(<NotificationBell />, document.getElementById('reactNavItems'));
React.render(<View />, document.getElementById('view'));

// React.render(<MdInfo />, document.getElementById('mdInfo'));

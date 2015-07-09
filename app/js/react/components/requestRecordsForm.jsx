'use strict';
const React = require('react');
const RequestForms = require('./requestForms.jsx');
const RequestLink = require('./generateRequestFormLink.jsx');
const NotificationBell = require('./notificationBell.jsx');
const MessageNotification = require('./messageNotification.jsx');

React.render(<MessageNotification/>, document.getElementById('messenging'));

React.render(<RequestLink/>, document.getElementById('reactMRLink'));

React.render(<RequestForms blankFormLink={'http://www.facebook.com'}/>, document.getElementById('reactMedicalRecordRequestForm'));

React.render(<NotificationBell/>, document.getElementById('reactNavItems'));

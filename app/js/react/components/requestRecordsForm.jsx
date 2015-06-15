'use strict';
const React = require('react');
const RequestForms = require('./requestForms.jsx');
const RequestLink = require('./generateRequestFormLink.jsx');
const NotificationBell = require('./notificationBell.jsx');
// let universalPost = require('../webapi/universalPost.js');


React.render(<RequestLink/>,
document.getElementById('reactMRLink'));

React.render(<RequestForms blankFormLink={'http://www.facebook.com'}/>,
document.getElementById('reactMedicalRecordRequestForm'));

React.render(<NotificationBell />, document.getElementById('reactNavItems'));

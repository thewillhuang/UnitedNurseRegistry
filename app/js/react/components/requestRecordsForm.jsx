'use strict';
var React = require('react');
var RequestForms = require('./requestForms.jsx');
var RequestLink = require('./generateRequestFormLink.jsx');
var NotificationBell = require('./notificationBell.jsx');
// var universalPost = require('../webapi/universalPost.js');


React.render(<RequestLink/>,
document.getElementById('reactMRLink'));

React.render(<RequestForms blankFormLink={'http://www.facebook.com'}/>,
document.getElementById('reactMedicalRecordRequestForm'));

React.render(<NotificationBell />, document.getElementById('reactNavItems'));

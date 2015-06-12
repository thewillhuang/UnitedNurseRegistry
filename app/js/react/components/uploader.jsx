'use strict';
var React = require('react');
var Urgent = require('./uploaderUrgentTag.jsx');
var PatientInfo = require('./patientInfo.jsx');

var grabUrl = function(url, lastIndexStartString, lastIndexEndString) {
  var startParseIndex = url.lastIndexOf(lastIndexStartString) + lastIndexStartString.length;
  var endParseIndex = url.lastIndexOf(lastIndexEndString);
  if (endParseIndex === -1) {
    endParseIndex = url.length;
  }
  return url.slice(startParseIndex, endParseIndex);
};

var grabToken = function() {
  return grabUrl(window.location.href, '?l=');
};

console.log('token', grabToken());

React.render(
  <Urgent guid={grabToken()} />,
  document.getElementById('reactUrgentTag'));

React.render(
  <PatientInfo guid={grabToken()} />,
  document.getElementById('reactPatientInfo'));

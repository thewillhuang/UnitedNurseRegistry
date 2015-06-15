'use strict';
const React = require('react');
const Urgent = require('./uploaderUrgentTag.jsx');
const PatientInfo = require('./patientInfo.jsx');

let grabUrl = (url, lastIndexStartString, lastIndexEndString) => {
  let startParseIndex = url.lastIndexOf(lastIndexStartString) + lastIndexStartString.length;
  let endParseIndex = url.lastIndexOf(lastIndexEndString);
  if (endParseIndex === -1) {
    endParseIndex = url.length;
  }
  return url.slice(startParseIndex, endParseIndex);
};

let grabToken = () => {
  return grabUrl(window.location.href, '?l=');
};

console.log('token', grabToken());

React.render(
  <Urgent guid={grabToken()} />,
  document.getElementById('reactUrgentTag'));

React.render(
  <PatientInfo guid={grabToken()} />,
  document.getElementById('reactPatientInfo'));

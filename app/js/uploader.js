'use strict';

var grabUrl = function(url, lastIndexStartString, lastIndexEndString) {
  var path = url;
  var startParseIndex = path.lastIndexOf(lastIndexStartString) + lastIndexStartString.length;
  var endParseIndex = path.lastIndexOf(lastIndexEndString);
  if (endParseIndex === -1) {
    endParseIndex = path.length;
  }
  return path.slice(startParseIndex, endParseIndex);
};

var Dropzone = window.Dropzone;
var previewNode = document.querySelector('#template');
previewNode.id = '';
var previewTemplate = previewNode.parentNode.innerHTML;
previewNode.parentNode.removeChild(previewNode);


var grabToken = function() {
  return grabUrl(window.location.href, '?l=');
};

var inboundheaders = {};
inboundheaders.Payload = JSON.stringify({
  key: grabToken()
});

console.log(inboundheaders);

var myDropzone = new Dropzone(document.body, { // Make the whole body a dropzone
  url: API_ROOT + 'api/upload/publicupload', // Set the url
  headers: inboundheaders,
  thumbnailWidth: 80,
  thumbnailHeight: 80,
  parallelUploads: 20,
  previewTemplate: previewTemplate,
  autoQueue: false, // Make sure the files aren't queued until manually added
  previewsContainer: '#previews', // Define the container to display the previews
  clickable: '.fileinput-button' // Define the element that should be used as click trigger to select files.
});

myDropzone.on('addedfile', function(file) {
  // Hookup the start button
  file.previewElement.querySelector('.start').onclick = function() { myDropzone.enqueueFile(file); };
});

// Update the total progress bar
myDropzone.on('totaluploadprogress', function(progress) {
  document.querySelector('#total-progress .progress-bar').style.width = progress + '%';
});

myDropzone.on('sending', function(file) {
  // Show the total progress bar when upload starts
  document.querySelector('#total-progress').style.opacity = '1';
  // And disable the start button
  file.previewElement.querySelector('.start').setAttribute('disabled', 'disabled');
});

// Hide the total progress bar when nothing's uploading anymore
myDropzone.on('queuecomplete', function() {
  document.querySelector('#total-progress').style.opacity = '0';
});

// Setup the buttons for all transfers
// The 'add files' button doesn't need to be setup because the config
// `clickable` has already been specified.
document.querySelector('#actions .start').onclick = function() {
  myDropzone.enqueueFiles(myDropzone.getFilesWithStatus(Dropzone.ADDED));
};
document.querySelector('#actions .cancel').onclick = function() {
  myDropzone.removeAllFiles(true);
};

require('./react/components/uploader.jsx');

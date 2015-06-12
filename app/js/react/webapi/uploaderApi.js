'use strict';

var universalPost = require('./universalPost.js');
var uploaderApi = {};

//getInboundGalleryObjectList
// returns a bunch of guids seperated by ",";
uploaderApi.getInboundGalleryObjectList = function(category, type, originalFileName, createdOnOrAfter, createdOnOrBefore, callback) {
  var url = 'api/galleryobjects/getgalleryobjectlist';
  var payload = {};
  payload.category = category;
  payload.type = type;
  payload.originalFileName = originalFileName;
  payload.createdOnOrAfter = createdOnOrAfter;
  payload.createdOnOrBefore = createdOnOrBefore;
  payload.manifestName = 'inbound';
  universalPost(payload, url, function(data){
    callback(data);
  });
};

module.exports = uploaderApi;

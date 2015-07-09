'use strict';

const universalPost = require('./universalPost.js');
let uploaderApi = {};

//getInboundGalleryObjectList
// returns a bunch of guids seperated by ",";
uploaderApi.getInboundGalleryObjectList = (category, type, originalFileName, createdOnOrAfter, createdOnOrBefore, callback) => {
  let url = 'api/galleryobjects/getgalleryobjectlist';
  let payload = {};
  payload.category = category;
  payload.type = type;
  payload.originalFileName = originalFileName;
  payload.createdOnOrAfter = createdOnOrAfter;
  payload.createdOnOrBefore = createdOnOrBefore;
  payload.manifestName = 'inbound';
  universalPost(payload, url, (data) => {
    callback(data);
  });
};

module.exports = uploaderApi;

'use strict';

var galleryObjectConstants = require('../constants/galleryObjectConstants.js');
var AppDispatcher = require('../dispatcher/appDispatcher.js');
var uploaderApi = require('../webapi/uploaderApi.js');
var galleryObjectApi = require('../webapi/galleryObjectApi.js');
var uuid = require('node-uuid');
var $ = require('jquery');

var galleryActions = {};

galleryActions.getAll = function() {
  uploaderApi.getInboundGalleryObjectList('', '', '', '', '', function(data){
    if (data.galleryObjectList) {
      // var galleryObjectGuidsArray = data.galleryObjectGuids.split(',');
      var galleryObjectGuidsArray = $.parseJSON(data.galleryObjectList);
      console.log(galleryObjectGuidsArray);
      for (var i = 0; i < galleryObjectGuidsArray.length; i++) {
        galleryActions.getOne(galleryObjectGuidsArray[i]);
      }
    }
  });
};

galleryActions.getOne = function(objectGuid) {
  galleryObjectApi.getGalleryObjectThumbnail(objectGuid, function(data){
    // console.log(data);
    data.objectGuid = objectGuid;
    console.log(data);
    AppDispatcher.dispatch({
      actionType: galleryObjectConstants.GALLERY_CREATE,
      payload: data,
      reactId: uuid.v4()
    });
  });
};

galleryActions.transferToInbox = function(objectGuid, reactId) {
  galleryObjectApi.moveGalleryObjectToPersonalManifest(objectGuid);
  AppDispatcher.dispatch({
    actionType: galleryObjectConstants.GALLERY_DESTROY,
    reactId: reactId
  });
};

module.exports = galleryActions;

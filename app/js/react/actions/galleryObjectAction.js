'use strict';

const galleryObjectConstants = require('../constants/galleryObjectConstants.js');
const AppDispatcher = require('../dispatcher/appDispatcher.js');
const uploaderApi = require('../webapi/uploaderApi.js');
const galleryObjectApi = require('../webapi/galleryObjectApi.js');
const uuid = require('node-uuid');
const $ = require('jquery');

let galleryActions = {};

galleryActions.getAll = () => {
  uploaderApi.getInboundGalleryObjectList('', '', '', '', '', (data) => {
    if (data.galleryObjectList) {
      // let galleryObjectGuidsArray = data.galleryObjectGuids.split(',');
      let galleryObjectGuidsArray = $.parseJSON(data.galleryObjectList);
      // console.log(galleryObjectGuidsArray);
      for (let i = 0; i < galleryObjectGuidsArray.length; i++) {
        galleryActions.getOne(galleryObjectGuidsArray[i]);
      }
    }
  });
};

galleryActions.getOne = (objectGuid) => {
  galleryObjectApi.getGalleryObjectThumbnail(objectGuid, (data) => {
    // console.log(data);
    data.objectGuid = objectGuid;
    // console.log(data);
    AppDispatcher.dispatch({
      actionType: galleryObjectConstants.GALLERY_CREATE,
      payload: data,
      reactId: uuid.v4()
    });
  });
};

galleryActions.transferToInbox = (objectGuid, reactId) => {
  galleryObjectApi.moveGalleryObjectToPersonalManifest(objectGuid);
  AppDispatcher.dispatch({
    actionType: galleryObjectConstants.GALLERY_DESTROY,
    reactId: reactId
  });
};

module.exports = galleryActions;

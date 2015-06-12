'use strict';
var AppDispatcher = require('../dispatcher/appDispatcher.js');
var ObjectPermissionConstants = require('../constants/objectPermissionConstants.js');
var uuid = require('node-uuid');
var InclusiveRelationshipApi = require('../webapi/inclusiveRelationshipApi.js');
var $ = require('jquery');

var ObjectPermissionActions = {
  createOne: function(inclusiveRelationshipGuid){
    InclusiveRelationshipApi.getInclusiveRelationship(inclusiveRelationshipGuid, function(data){
      AppDispatcher.dispatch({
        actionType: ObjectPermissionConstants.USER_CREATE,
        payload: data,
        id: uuid.v1()
      });
    });
  },

  grabInfo: function(objectGuid, objectType){
    // flush the store
    AppDispatcher.dispatch({
      actionType: ObjectPermissionConstants.USER_FLUSH
    });

    InclusiveRelationshipApi.getObjectInclusiveRelationshipList(objectGuid, objectType, function(data){
      // var guidArray = data.inclusiveListGuids.split(',');
      var guidArray = $.parseJSON(data.inclusiveListGuids);
      for (var i = 0; i < guidArray.length; i++) {
        ObjectPermissionActions.createOne(guidArray[i]);
      }
    });

  },

  delete: function(){},

  update: function(){}
};

module.export = ObjectPermissionActions;

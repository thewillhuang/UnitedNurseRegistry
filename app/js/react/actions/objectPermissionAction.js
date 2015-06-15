'use strict';
const AppDispatcher = require('../dispatcher/appDispatcher.js');
const ObjectPermissionConstants = require('../constants/objectPermissionConstants.js');
const uuid = require('node-uuid');
const InclusiveRelationshipApi = require('../webapi/inclusiveRelationshipApi.js');
const $ = require('jquery');

let ObjectPermissionActions = {
  createOne (inclusiveRelationshipGuid){
    InclusiveRelationshipApi.getInclusiveRelationship(inclusiveRelationshipGuid, (data) => {
      AppDispatcher.dispatch({
        actionType: ObjectPermissionConstants.USER_CREATE,
        payload: data,
        id: uuid.v1()
      });
    });
  },

  grabInfo (objectGuid, objectType){
    // flush the store
    AppDispatcher.dispatch({
      actionType: ObjectPermissionConstants.USER_FLUSH
    });

    InclusiveRelationshipApi.getObjectInclusiveRelationshipList(objectGuid, objectType, (data) => {
      // let guidArray = data.inclusiveListGuids.split(',');
      let guidArray = $.parseJSON(data.inclusiveListGuids);
      for (let i = 0; i < guidArray.length; i++) {
        ObjectPermissionActions.createOne(guidArray[i]);
      }
    });

  },

  delete (){},

  update (){}
};

module.export = ObjectPermissionActions;

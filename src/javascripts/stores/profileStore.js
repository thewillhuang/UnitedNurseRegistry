'use strict';

import shiftDispatcher from '../dispatcher/appDispatcher.js';
import shiftConst from '../constants/shiftConstants.js';
import EventEmitter from 'events';
import _ from 'lodash';

const Actions = shiftConst;
const CHANGE_EVENT = 'shift';
let _shifts = [];

const loadShifts = (array) => {
  _shifts = array;
};

const sortByPriceAsc = () => {
  const array = _.sortBy(_shifts, function(el) {
    return el.payPerHour;
  });
  _shifts = array;
};

const sortByPriceDec = () => {
  const array = _.sortBy(_shifts, function(el) {
    return el.payPerHour;
  });
  _shifts = _(array).reverse();
};

const shiftStore = _.assign({}, EventEmitter.prototype, {
  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getAll: function() {
    return _shifts;
  },
});

shiftStore.dispatchToken = shiftDispatcher.register(function(action) {
  console.log('action from store event listner', action);
  switch (action.type) {
  case Actions.LOAD:
    loadShifts(action.payload);
    shiftStore.emitChange();
    break;

  case Actions.SORTBYPRICEASC:
    sortByPriceAsc();
    shiftStore.emitChange();
    break;

  case Actions.SORTBYPRICEDEC:
    sortByPriceDec();
    shiftStore.emitChange();
    break;

  default:
    break;
  }
});

export default shiftStore;

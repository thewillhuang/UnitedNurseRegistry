'use strict';
var React = require('react');
var ListItem = require('./circleItem.jsx');
var AddItem = require('./circleOfTrustAddButton.jsx');
var CircleStore = require('../stores/circleStore.js');
var CircleActions = require('../actions/circleAction.js');

var getStateFromStore = function () {
  return {
    circle: CircleStore.getAll()
  };
};

var ListBox = React.createClass({

  getInitialState: function () {
    return getStateFromStore();
  },

  componentDidMount: function () {
    CircleStore.addChangeListener(this._onChange);
    CircleActions.getFromServer();
  },

  componentWillUnmount: function () {
    CircleStore.removeChangeListener(this._onChange);
  },

  _onChange: function () {
    this.setState(getStateFromStore());
  },

  render: function () {
    // console.log(this.state.circle, this.state.pending);
    var ListItems = this.state.circle.map(function (payload, index) {
      return (
        <ListItem index={index} key={index} payload={payload}/>
      );
    });

    return (
      <div className='general-item-list'>
        <AddItem />
          {ListItems}
      </div>
    );
  }

});

module.exports = ListBox;

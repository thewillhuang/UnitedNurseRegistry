'use strict';
const React = require('react');
const ListItem = require('./circleItem.jsx');
const AddItem = require('./circleOfTrustAddButton.jsx');
const CircleStore = require('../stores/circleStore.js');
const CircleActions = require('../actions/circleAction.js');

let getStateFromStore = () => {
  return {
    circle: CircleStore.getAll()
  };
};

let ListBox = React.createClass({

  getInitialState() {
    return getStateFromStore();
  },

  componentDidMount() {
    CircleStore.addChangeListener(this._onChange);
    CircleActions.getFromServer();
  },

  componentWillUnmount() {
    CircleStore.removeChangeListener(this._onChange);
  },

  _onChange() {
    this.setState(getStateFromStore());
  },

  render() {
    // console.log(this.state.circle, this.state.pending);
    let ListItems = this.state.circle.map((payload, index) => {
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

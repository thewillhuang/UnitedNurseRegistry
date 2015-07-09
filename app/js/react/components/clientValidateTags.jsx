'use strict';
const React = require('react');
const galleryObjectAction = require('../actions/galleryObjectAction.js');
const OverlayTrigger = require('react-bootstrap').OverlayTrigger;
const Tooltip = require('react-bootstrap').Tooltip;

var ClientValidateTags = React.createClass({

  propTypes: {
    value: React.PropTypes.string.isRequired,
    reactId: React.PropTypes.string.isRequired,
    index: React.PropTypes.number.isRequired,
    array: React.PropTypes.array.isRequired
  },

  handleClick() {
    let array = this.props.array;
    array.splice(this.props.index, 1);
    galleryObjectAction.update(this.props.reactId, {
      categoryList: array
    });
  },

  render: function() {
    return (
      <OverlayTrigger placement='top' overlay={<Tooltip>Click to Delete Tag</Tooltip>}>
          <span style={{cursor: 'pointer', textAlign: 'center', float: 'left', display: 'inline', marginTop: 5, marginBottom: 5, marginLeft: 20, paddingLeft: 7, paddingRight: 5, marginRight: 10, borderRadius: '0.25em', backgroundColor: '#428BCA', color: 'white'}} onClick={this.handleClick} >
            {this.props.value}
            <i className="fa fa-times" style={{marginLeft: 5, borderLeft: '1px ridge white', paddingLeft: 5}}></i>
          </span>
      </OverlayTrigger>
    );
  }

});

module.exports = ClientValidateTags;

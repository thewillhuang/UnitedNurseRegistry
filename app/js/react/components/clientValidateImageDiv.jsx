'use strict';
var React = require('react');
var galleryObjectAction = require('../actions/galleryObjectAction.js');

var ImageDiv = React.createClass({

  propTypes: {
    photoData: React.PropTypes.string.isRequired,
    guid: React.PropTypes.string.isRequired,
    reactId: React.PropTypes.string.isRequired
  },

  handleClick: function() {
    // console.log('guid', this.props.guid);
    // console.log('reactId',this.props.reactId);
    galleryObjectAction.transferToInbox(this.props.guid, this.props.reactId);
  },

  render: function() {
    return (
      <div className='imageContainer'>
        <img onClick={this.handleClick} src={this.props.photoData} style={{cursor: 'pointer'}}></img>
      </div>
    );
  }

});

module.exports = ImageDiv;

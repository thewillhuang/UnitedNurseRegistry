'use strict';
const React = require('react');
const galleryObjectAction = require('../actions/galleryObjectAction.js');
const OverlayTrigger = require('react-bootstrap').OverlayTrigger;
const Tooltip = require('react-bootstrap').Tooltip;

let ImageDiv = React.createClass({

  propTypes: {
    photoData: React.PropTypes.string.isRequired,
    guid: React.PropTypes.string.isRequired,
    reactId: React.PropTypes.string.isRequired
  },

  handleClick() {
    // console.log('guid', this.props.guid);
    // console.log('reactId',this.props.reactId);
    galleryObjectAction.transferToInbox(this.props.guid, this.props.reactId);
  },

  render() {
    return (
      <div className='imageContainer'>
        <OverlayTrigger placement='top' overlay={<Tooltip>Add to Gallery</Tooltip>}>
          <img onClick={this.handleClick} src={this.props.photoData} style={{cursor: 'pointer'}}></img>
        </OverlayTrigger>
      </div>
    );
  }

});

module.exports = ImageDiv;

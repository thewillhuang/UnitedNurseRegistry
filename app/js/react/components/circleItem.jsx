'use strict';
var React = require('react');
var CircleActions = require('../actions/circleAction');
var ButtonGroup = require('./circleItemButtonsGroup.jsx');

var style = {};

style.text = {};

style.text.fontWeight = 600;

var circleListItem = React.createClass({

  propTypes: {
    payload: React.PropTypes.object.isRequired,
    index: React.PropTypes.number.isRequired
  },

  getInitialState: function () {
    return {
      contactInfo: 'none',
      elip: 'fa fa-ellipsis-h pull-right elip'
    };
  },

  handleRemove: function () {
    this.setState({
      contactInfo: 'none'
    });
    CircleActions.destroy(this.props.payload.guid, this.props.payload.reactId);
    this.setState({
      contactInfo: 'none'
    });
  },

  handleToggle: function () {
//hide or display the content
    if (this.state.contactInfo === 'none') {
      this.setState({
        contactInfo: '',
        elip: ''
      });
    } else {
      this.setState({
        contactInfo: 'none',
        elip: 'fa fa-ellipsis-h pull-right elip'
      });
    }
  },

  acceptMembership: function () {
    CircleActions.acceptMembership(this.props.payload.email, this.props.payload.reactId);
    this.setState({
      contactInfo: 'none'
    });
  },

  revokeMembership: function () {
    this.setState({
      contactInfo: 'none'
    });
    CircleActions.revokeMembership(this.props.payload.email || this.props.payload.email || this.props.payload.Email, this.props.payload.reactId);
    this.setState({
      contactInfo: 'none'
    });
  },

  handleMembership: function () {
    CircleActions.request(this.props.payload.email || this.props.payload.email);
    this.setState({
      contactInfo: 'none'
    });
  },

//TODO
  handleEdit: function (data, props) {
// console.log('edit function called', data, reactId, cotGuid);
    CircleActions.update(data, props);
    this.setState({
      contactInfo: 'none'
    });
  },

  handleState: function () {
    if (this.props.payload.membership) {
      return this.props.payload.membership;
    } else if (this.props.payload.existingProfile === 'true') {
      return 'member';
    } else {
      return 'contacts';
    }
  },

  render: function () {
    var fullName = (this.props.payload.firstName || '') + ' ' + (this.props.payload.lastName || '');
    var profilePhoto = '';
    if (this.props.payload.profilePhoto) {
      profilePhoto = 'data:image/jpeg;charset=utf-8;base64,' + this.props.payload.profilePhoto;
    } else {
      profilePhoto = '../../images/ProfilePlaceholder.png';
    }
    return (
      <div className='item'>
        <div className='item-head' onClick={this.handleToggle} style={{cursor: 'pointer'}}>
          <div className='item-details' style={{width: '90%'}}>
            <div style={{display: 'inline-block', position: 'relative', top: '-10'}}>
              <img className='item-pic img-circle' src={profilePhoto} style={{width: '50px', height: '50px'}}/>
            </div>
            <div style={{display: 'inline-block', marginTop: '10px'}}>
              <a className='item-name primary-link circleOfTrustName' style={{marginLeft: '10px', position: 'relative', top: '10'}}>{fullName}</a>
              <br/>
              <a className='item-name primary-link' style={{marginLeft: '10px', fontWeight: 100, position: 'relative', top: '10' }}>{this.props.payload.email || ''}</a>
              <br/>
              <a className='item-name primary-link' style={{marginLeft: '10px', fontWeight: 100, position: 'relative', top: '10' }}>{this.props.payload.title || ''}</a>
            </div>
            <span className='label label-info pull-right' style={{marginTop: '15px'}}>{this.handleState()}</span>
            <div className='row'>
              <i className={this.state.elip} onClick={this.handleToggle} style={{cursor: 'pointer'}}></i>
            </div>
          </div>
        </div>
        <div className='item-body center-block' style={{display: this.state.contactInfo, width: '90%'}}>
          <hr className='center-block' style={{width: '70%'}}/>
          <ButtonGroup acceptMembership={this.acceptMembership} handleDelete={this.handleRemove} handleEdit={this.handleEdit} handleMembership={this.handleMembership} payload={this.props.payload} revokeMembership={this.revokeMembership} state={this.handleState()}/>
          <p style={{color: '#3199CF'}}>
            Address
          </p>
          <div className="row">
            <div className="col-md-12 col-sm-12">
              <p className="circleOfTrustDataTitle">Street Address</p>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 col-sm-12" style={{marginBottom: '10px'}}>{this.props.payload.address + ' ' + this.props.payload.address2}</div>
          </div>
          <div className="row">
            <div className="col-md-6 col-sm-6">
              <p className="circleOfTrustDataTitle">City</p>
            </div>
            <div className="col-md-3">
              <p className="circleOfTrustDataTitle">State</p>
            </div>
            <div className="col-md-3">
              <p className="circleOfTrustDataTitle">Zip</p>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 col-sm-6">
              <p>{this.props.payload.city || this.props.payload.City || ' - '}</p>
            </div>
            <div className="col-md-3">
              <p>{this.props.payload.state || this.props.payload.State || ' - '}</p>
            </div>
            <div className="col-md-3">
              <p>{this.props.payload.zip || this.props.payload.Zip || ' - '}</p>
            </div>
          </div>
          <div className="row">
            <p style={{color: '#3199CF', marginLeft: '14px'}}>Contacts</p>
          </div>
          <div className="row">
            <div className="col-md-6 col-sm-6">
              <p className="circleOfTrustDataTitle">Home</p>
            </div>
            <div className="col-md-6 col-sm-6">
              <p className="circleOfTrustDataTitle">Cell</p>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 col-sm-6">
              <p>{this.props.payload.phone || ' - '}</p>
            </div>
            <div className="col-md-6 col-sm-6">
              <p>{this.props.payload.mobile || ' - '}</p>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 col-sm-6">
              <p className="circleOfTrustDataTitle">Fax</p>
            </div>
            <div className="col-md-6 col-sm-6">
              <p className="circleOfTrustDataTitle">Email</p>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 col-sm-6">
              <p>{this.props.payload.fax || ' - '}</p>
            </div>
            <div className="col-md-6 col-sm-6">
              <p>{this.props.payload.email || ' - '}</p>
            </div>
          </div>
          <div className='row'>
            <i className="fa fa-ellipsis-v pull-right elip" onClick={this.handleToggle} style={{marginRight: '35px', cursor: 'pointer'}}></i>
          </div>
        </div>
      </div>
    );
  }

});

module.exports = circleListItem;

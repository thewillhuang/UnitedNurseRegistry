'use strict';
const React = require('react');
const Button = require('react-bootstrap').Button;
const ButtonToolbar = require('react-bootstrap').ButtonToolbar;
const ModalTrigger = require('react-bootstrap').ModalTrigger;
const EditModal = require('./circleOfTrustEditModal.jsx');
const OverlayTrigger = require('react-bootstrap').OverlayTrigger;
const Tooltip = require('react-bootstrap').Tooltip;


const ButtonsGroup = React.createClass({

  propTypes: {
    handleMembership: React.PropTypes.func.isRequired,
    handleEdit: React.PropTypes.func.isRequired,
    handleDelete: React.PropTypes.func.isRequired,
    state: React.PropTypes.string.isRequired,
    payload: React.PropTypes.object.isRequired,
    acceptMembership: React.PropTypes.func.isRequired,
    revokeMembership: React.PropTypes.func.isRequired
  },

  render() {
    // console.log(this.props.payload);

    let stateContacts = (
      <div>
        <OverlayTrigger placement='top' overlay={<Tooltip>Delete Contact</Tooltip>}>
          <i className="fa fa-lg fa-trash pull-right" onClick={this.props.handleDelete} style={{cursor: 'pointer', color: '#02658C'}}></i>
        </OverlayTrigger>
          <ModalTrigger modal={<EditModal payload={this.props.payload} handleEdit={this.props.handleEdit}/>}>
            <OverlayTrigger placement='top' overlay={<Tooltip>Edit Contact</Tooltip>}>
            <i className="fa fa-lg fa-pencil pull-right" style={{marginRight: '10', cursor: 'pointer', color: '#02658C'}}></i>
            </OverlayTrigger>
          </ModalTrigger>
      </div>
    );

    //TODO bug here, this.props.revokeMembership should work, but it returns permission denied eventhough im the person sending the request to connect out.
    let stateInvites = (
      <div>
        <ButtonToolbar>
          <Button bsStyle='danger' className='pull-right' onClick={this.props.revokeMembership}><i className="fa fa-trash"></i></Button>
        </ButtonToolbar>
      </div>
    );

    // button group for cicle of trust memberhsip requests by others to you.
    //TODO bug here, i cannot reject an invitation by another member.
    let stateRequests = (
      <div>
        <ButtonToolbar>
          <Button onClick={this.props.acceptMembership}><i className="fa fa-check"></i></Button>
          <Button bsStyle='danger' className='pull-right' onClick={this.props.revokeMembership}><i className="fa fa-trash"></i></Button>
        </ButtonToolbar>
      </div>
    );

    let stateMember = (
      <div>
        <ButtonToolbar>
          <Button bsStyle='danger' className='pull-right' onClick={this.props.handleDelete}><i className="fa fa-trash"></i></Button>
        </ButtonToolbar>
      </div>
    );

    let stateHasAccess = (
      <div>
        <ButtonToolbar>
          <Button bsStyle='danger' className='pull-right' onClick={this.props.revokeMembership}><i className="fa fa-trash"></i></Button>
        </ButtonToolbar>
      </div>
    );

    if (this.props.state === 'contacts') {
      return stateContacts;
    } else if (this.props.state === 'invites'){
      return stateInvites;
    } else if (this.props.state === 'requests'){
      return stateRequests;
    } else if (this.props.state === 'member') {
      return stateMember;
    } else if (this.props.state === 'has access') {
      return stateHasAccess;
    } else {
      return (
        <div>
          {this.props.state}
        </div>
      );
    }

  }

});

module.exports = ButtonsGroup;

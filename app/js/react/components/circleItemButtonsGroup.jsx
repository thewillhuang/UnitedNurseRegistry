'use strict';
var React = require('react');
var Button = require('react-bootstrap').Button;
var ButtonToolbar = require('react-bootstrap').ButtonToolbar;
var ModalTrigger = require('react-bootstrap').ModalTrigger;
var EditModal = require('./circleOfTrustEditModal.jsx');

var ButtonsGroup = React.createClass({

  propTypes: {
    handleMembership: React.PropTypes.func.isRequired,
    handleEdit: React.PropTypes.func.isRequired,
    handleDelete: React.PropTypes.func.isRequired,
    state: React.PropTypes.string.isRequired,
    payload: React.PropTypes.object.isRequired,
    acceptMembership: React.PropTypes.func.isRequired,
    revokeMembership: React.PropTypes.func.isRequired
  },

  render: function() {
    // console.log(this.props.payload);

    var stateContacts = (
      <div>
          <i className="fa fa-lg fa-trash pull-right" onClick={this.props.handleDelete} style={{cursor: 'pointer', color: '#02658C'}}></i>
          <ModalTrigger modal={<EditModal payload={this.props.payload} handleEdit={this.props.handleEdit}/>}>
            <i className="fa fa-lg fa-pencil pull-right" style={{marginRight: '10px', cursor: 'pointer', color: '#02658C'}}></i>
          </ModalTrigger>
      </div>
    );

    //TODO bug here, this.props.revokeMembership should work, but it returns permission denied eventhough im the person sending the request to connect out.
    var stateInvites = (
      <div>
        <ButtonToolbar>
          <Button bsStyle='danger' className='pull-right' onClick={this.props.revokeMembership}><i className="fa fa-trash"></i></Button>
        </ButtonToolbar>
      </div>
    );

    // button group for cicle of trust memberhsip requests by others to you.
    //TODO bug here, i cannot reject an invitation by another member.
    var stateRequests = (
      <div>
        <ButtonToolbar>
          <Button onClick={this.props.acceptMembership}><i className="fa fa-check"></i></Button>
          <Button bsStyle='danger' className='pull-right' onClick={this.props.revokeMembership}><i className="fa fa-trash"></i></Button>
        </ButtonToolbar>
      </div>
    );

    var stateMember = (
      <div>
        <ButtonToolbar>
          <Button bsStyle='danger' className='pull-right' onClick={this.props.handleDelete}><i className="fa fa-trash"></i></Button>
        </ButtonToolbar>
      </div>
    );

    var stateHasAccess = (
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

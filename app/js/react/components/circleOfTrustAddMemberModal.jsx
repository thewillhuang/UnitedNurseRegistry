'use strict';
var Modal = require('react-bootstrap').Modal;
var Input = require('react-bootstrap').Input;
var React = require('react');
var Button = require('react-bootstrap').Button;
var ButtonToolbar = require('react-bootstrap').ButtonToolbar;
var CircleActions = require('../actions/circleAction.js');

var MyModal = React.createClass({
  propTypes: {
    onRequestHide: React.PropTypes.func.isRequired
  },

  getInitialState: function() {
    return {
      member: '',
      relationshipMember: ''
    };
  },

  validate: function(type){
    var typeLength = this.state[type].length;
    if (typeLength >= 2) { return 'success'; }
    else if (typeLength >= 1) { return 'warning'; }
    else if (typeLength < 1) { return 'error'; }
  },

  handleChange: function() {
    this.setState({
      member: this.refs.member.getValue(),
      relationshipMember: this.refs.relationshipMember.getValue()
      // titleMember: this.refs.titleMember.getValue(),
    });
  },

  handleMembership: function(){
    if (this.state.member && this.state.relationshipMember){
      CircleActions.request(this.state.relationshipMember, this.state.titleMember, this.state.member);
      this.props.onRequestHide();
    } else {
      window.swal('please fillout an email address to add memeber');
    }
  },

  render: function(){
    // console.log(this.state);
    return (
      <Modal onRequestHide={this.props.onRequestHide} bsStyle='primary' title='Request an existing Member to join your Circle of Trust' animation={true}>
        <div className='modal-body'>

          <div style={{marginBottom: '10px'}}>
            All fields required
          </div>

          <div className='row'>
            <div className='col-md-6 col-sm-6'>

              <Input
                type='text'
                value={this.state.member}

                ref='member'
                label='Email Address'
                bsStyle={this.validate('member')}
                onChange={this.handleChange} />

            </div>

            <div className='col-md-6 col-sm-6'>
              <Input
                type='text'
                value={this.state.relationshipMember}
                label='Relationship'

                bsStyle={this.validate('relationshipMember')}
                ref='relationshipMember'
                onChange={this.handleChange} />
            </div>

          </div>
        </div>

        <div className='modal-footer'>
          <ButtonToolbar>
            <Button onClick={this.props.onRequestHide}>Cancel</Button>
            <Button onClick={this.handleMembership} bsStyle='primary'>Request Membership</Button>
          </ButtonToolbar>
        </div>
      </Modal>
    );
  }
});

module.exports = MyModal;

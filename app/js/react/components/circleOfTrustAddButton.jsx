'use strict';
var React = require('react');
var Button = require('react-bootstrap').Button;
var ModalTrigger = require('react-bootstrap').ModalTrigger;
var CircleOfTrustModal = require('./circleOfTrustModal.jsx');
// var CircleAddMember = require('./circleOfTrustAddMemberModal.jsx');
var ButtonToolbar = require('react-bootstrap').ButtonToolbar;

var AddItem = React.createClass({

  render: function() {
    // console.log('circleAddButton rendered');
              // <ModalTrigger modal={<CircleAddMember/>}>
              //   <Button className='pull-left' bsStyle='primary'>Add Member</Button>
              // </ModalTrigger>
    return (
      <div className='item' style={{borderBottom: '0px'}}>
        <div className='item-head'>
          <div className='item-details' style={{width: '90%'}}>
            <ButtonToolbar>
              <ModalTrigger modal={<CircleOfTrustModal/>}>
                <Button className='pull-left' bsStyle='primary'>Create Contact</Button>
              </ModalTrigger>
            </ButtonToolbar>
          </div>
        </div>
      </div>
    );
  }

});

module.exports = AddItem;

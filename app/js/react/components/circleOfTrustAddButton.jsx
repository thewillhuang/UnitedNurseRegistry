/* @flow */
'use strict';
const React = require('react');
const Button = require('react-bootstrap').Button;
const ModalTrigger = require('react-bootstrap').ModalTrigger;
const CircleOfTrustModal = require('./circleOfTrustModal.jsx');
// let CircleAddMember = require('./circleOfTrustAddMemberModal.jsx');
const ButtonToolbar = require('react-bootstrap').ButtonToolbar;

let AddItem = React.createClass({

  render() {
// console.log('circleAddButton rendered');
// <ModalTrigger modal={<CircleAddMember/>}>
//   <Button className='pull-left' bsStyle='primary'>Add Member</Button>
// </ModalTrigger>
    return (
      <div className='item' style={{borderBottom: '0'}}>
        <div className='item-head'>
          <div className='item-details' style={{width: '90%'}}>
            <ButtonToolbar>
              <ModalTrigger modal={<CircleOfTrustModal/>}>
                <Button bsStyle='primary' className='pull-left'>Create Contact</Button>
              </ModalTrigger>
            </ButtonToolbar>
          </div>
        </div>
      </div>
    );
  }

});

module.exports = AddItem;

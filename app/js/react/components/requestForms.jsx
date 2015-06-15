'use strict';
const React = require('react');
const Input = require('react-bootstrap').Input;
const Button = require('react-bootstrap').Button;
const manifestApi = require('../webapi/manifestApi.js');
const moment = require('moment');

let RequestForms = React.createClass({

  propTypes: {
    blankFormLink: React.PropTypes.string.isRequired
  },

  getInitialState() {
    return {
      email: '',
      expiration: 14
    };
  },

  validationState(){
    let validateEmail = (emailAddress) => {
      let re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
      return re.test(emailAddress);
    };
    let email = this.state.email;
    let length = this.state.email.length;
    if (validateEmail(email)) {
      return 'success';
      }
    // else if (length >= 3) { return 'warning'; }
    else if (length > 0) { return 'error'; }
  },

  handleChange(){
    this.setState({
      email: this.refs.emailInput.getValue(),
      providerFirstName: this.refs.providerFirstName.getValue(),
      providerLastName: this.refs.providerLastName.getValue(),
      businessName: this.refs.businessName.getValue(),
      phoneNumber: this.refs.phoneNumber.getValue(),
      providerType: this.refs.OtherText.getValue(),
      urgent: this.refs.urgent.getChecked(),
      terms: this.refs.terms.getChecked(),
      expiration: this.refs.expiration.getValue()
    });
  },

  // providerType: this.refs.providerType.getChecked()
  handleRadioChange(){
    let selected = '';
    if (this.refs.PrimaryCare.getChecked()){
      selected = 'PrimaryCare';
    }
    if (this.refs.Specialist.getChecked()){
      selected = 'Specialist';
    }
    if (this.refs.Business.getChecked()){
      selected = 'Business';
    }
    // if (this.refs.Other.getChecked()){
    //   selected = 'Other';
    // }
    this.setState({
      providerType: selected
    });
  },

  handleSubmit(){
    if (this.state.terms && this.validationState() === 'success' && this.state.expiration !== 0) {
      let time = moment().add(this.state.expiration, 'd')._d;
      manifestApi.submitRequestForMedicalRecords(this.state.email, time, this.state.providerType, this.state.businessName, this.state.phoneNumber, this.state.urgent, this.state.providerFirstName, this.state.providerLastName, (data) => {
        if (data) {
          window.swal(data.Success);
        }
      });
    } else {
      window.swal('please select terms, valid email, and expiration days');
    }
  },

  render() {
    console.log(this.state);
    return (
      <div>
        <div className='row'>
          <div className='col-md-12 col-sm-12 form-header'>
            Option 1: I have my provider's email address
          </div>
        </div>

        <div className='row'>
          <div className='col-md-12 col-sm-12 formHeader'>
            Email Address
          </div>
        </div>

        <div className='row'>

          <div className='col-md-6 col-sm-6'>
            <Input
                type='email'
                value={this.state.email}
                bsStyle={this.validationState()}
                ref='emailInput'
                hasFeedback
                onChange={this.handleChange}
              />
          </div>

          <div className='col-md-6 col-sm-6 requiredField'>
            Required Field
          </div>

        </div>

        <div className='row'>
          <div className='col-md-12 col-sm-12 formHeader'>
            Provider Type
          </div>
        </div>

        <div className='selectType row'>
          <form>
            <div className='col-md-2 col-sm-2'>
              <Input type='radio'
                name='providerType'
                ref='PrimaryCare'
                onChange={this.handleRadioChange}
                label='Primary Care'/>
            </div>
            <div className='col-md-2 col-sm-2'>
              <Input
                type='radio'
                name='providerType'
                ref='Specialist'
                onChange={this.handleRadioChange}
                label='Specialist'/>
            </div>
            <div className='col-md-2 col-sm-2'>
              <Input type='radio'
                name='providerType'
                ref='Business'
                onChange={this.handleRadioChange}
                label='Business'/>
            </div>
            <div className='col-md-4 col-sm-4'>
              <Input type='text' name='providerType' ref='OtherText' onChange={this.handleChange} placeholder='Other'/>
            </div>
          </form>
        </div>

        <div className='row'>

          <div className='col-md-6 col-sm-6'>
            <div className='row'>
              <div className='col-md-12 col-sm-12 formHeader'>Provider's First Name</div>
            </div>
            <div className='row'>
              <div className='col-md-12 col-sm-12'>
                <Input
                  type='text'
                  ref='providerFirstName'
                  onChange={this.handleChange}
                  value={this.state.providerFirstName}
                  />
              </div>
            </div>
          </div>

          <div className='col-md-6 col-sm-6'>
            <div className='row'>
              <div className='col-md-12 col-sm-12 formHeader'>Provider's Last Name</div>
            </div>
            <div className='row'>
              <div className='col-md-12 col-sm-12'>
                <Input
                  type='text'
                  ref='providerLastName'
                  onChange={this.handleChange}
                  value={this.state.providerLastName}
                  />
              </div>
            </div>
          </div>

        </div>


        <div className='row'>

          <div className='col-md-6 col-sm-6'>
            <div className='row'>
              <div className='col-md-12 col-sm-12 formHeader'>Provider's Business Name</div>
            </div>
            <div className='row'>
              <div className='col-md-12 col-sm-12'>
                <Input
                  type='text'
                  ref='businessName'
                  onChange={this.handleChange}
                  value={this.state.businessName}
                  />
              </div>
            </div>
          </div>

          <div className='col-md-6 col-sm-6'>
            <div className='row'>
              <div className='col-md-12 col-sm-12 formHeader'>Provider's Phone Number</div>
            </div>
            <div className='row'>
              <div className='col-md-12 col-sm-12'>
                <Input
                  type='text'
                  ref='phoneNumber'
                  onChange={this.handleChange}
                  value={this.state.phoneNumber}
                  />
              </div>
            </div>
          </div>

        </div>

      <div className='row'>
        <div className='col-md-6 col-sm-6'>
          <div className='row'>
            <div className='col-md-12 col-sm-12 formHeader'>Request Expiration (in days)</div>
          </div>
          <div className='row'>
            <div className='col-md-12 col-sm-12'>
              <Input
                type='number'
                ref='expiration'
                onChange={this.handleChange}
                value={this.state.expiration}
                />
            </div>
          </div>
        </div>
      </div>

        <div className='row no-bottom-margin'>
          <div className='col-md-12 col-sm-12'>
            <label className='checkbox-inline'>
              <Input ref='urgent' type='checkbox' onChange={this.handleChange}/>
              <p className='checkbox-label'>click here to indicate that this is an <strong className='terms'>URGENT</strong> request</p>
            </label>
          </div>
        </div>

        <div className='row no-bottom-margin'>
          <div className='col-md-12 col-sm-12'>
            <label className='checkbox-inline'>
              <Input ref='terms' type='checkbox' onChange={this.handleChange}/>
              <p className='checkbox-label'>I have read and agree with the <span className='terms'>Terms and Conditions</span></p>
            </label>
          </div>
        </div>
        <div className='row no-bottom-margin'>
          <div className='col-md-2 col-sm-3'>
            <Button className='btn-start' onClick={this.handleSubmit}>Submit</Button>
          </div>
        </div>

      </div>
    );
  }

});

// <div className='row'>
//   <div className='col-md-12 col-sm-12 terms-warning terms'>
//     It is required by law that you provided a signed authroization for disclosure of protect health information.
//   </div>
// </div>
// <div className='row'>
//   <div className='col-md-8 col-sm-8'>
//     Click <a href={this.props.blankFormLink}>here</a> to sign a form that will be attached to your request or upload your own.
//   </div>
//   <div className='col-md-4 col-sm-4'>
//     <Input type='file'/>
//   </div>
// </div>

module.exports = RequestForms;

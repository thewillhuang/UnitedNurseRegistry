'use strict';
const Modal = require('react-bootstrap').Modal;
const Input = require('react-bootstrap').Input;
const React = require('react');
const Button = require('react-bootstrap').Button;
const ButtonToolbar = require('react-bootstrap').ButtonToolbar;
const CircleActions = require('../actions/circleAction.js');
const vmasker = require('vanilla-masker');

// let injectTapEventPlugin = require('react-tap-event-plugin');
// let Snackbar = require('material-ui').snackbar;
//
// injectTapEventPlugin();

let MyModal = React.createClass({
  propTypes: {
    onRequestHide: React.PropTypes.func
  },

  getInitialState() {
    return {
      firstName: '',
      lastName: '',
      // middleName: '',
      relationship: '',
      email: '',
      profilePhoto: '',
      title: '',
      zip: '',
      address: '',
      address2: '',
      state: '',
      phone: '',
      mobile: '',
      fax: ''
    };
  },

  validate(type) {
    let typeLength = this.state[type].length;
    if (typeLength >= 2) { return 'success'; }
    else if (typeLength >= 1) { return 'warning'; }
    else if (typeLength < 1) { return 'error'; }
  },

  convertFileToBase64() {
    let reader = new FileReader();
    reader.readAsDataURL(this.refs.profilePhoto.getDOMNode().files[0]);
    reader.onload = (oFREvent) => {
      let profilePhoto = oFREvent.target.result;
      this.setState({
        profilePhoto: profilePhoto.split(',').pop()
      });
    };
  },

  handleChange() {
    this.setState({
      firstName: this.refs.firstName.getValue(),
      lastName: this.refs.lastName.getValue(),
      // middleName: this.refs.middleName.getValue(),
      relationship: this.refs.relationship.getValue(),
      title: this.refs.title.getValue(),
      email: this.refs.email.getValue(),
      address: this.refs.address.getValue(),
      address2: this.refs.address2.getValue(),
      zip: this.refs.zip.getValue(),
      city: this.refs.city.getValue(),
      state: vmasker.toPattern(this.refs.state.getValue(), 'AA'),
      phone: vmasker.toPattern(this.refs.phone.getValue(), '(999) 999-9999'),
      mobile: vmasker.toPattern(this.refs.mobile.getValue(), '(999) 999-9999'),
      fax: vmasker.toPattern(this.refs.fax.getValue(), '(999) 999-9999')
    });
  },

  //TODO need to check if all validaitons passed before allowing them to submit.
  handleSubmit(){
    // console.log(this.state);
    if (this.state.firstName && this.state.lastName || this.state.title) {
      CircleActions.create(this.state);
      this.props.onRequestHide();
      // Snackbar.show()
    } else {
      window.swal('please fill out first name, last name and relationship');
    }
  },

  render(){
    // console.log(this.state);
    let profilePhotoPreview = '';
    if (this.state.profilePhoto) {
      profilePhotoPreview = 'data:image/jpeg;charset=utf-8;base64,' + this.state.profilePhoto;
    }
    // <Snackbar message='Saving contact information'/>
          // <div className="row">
          //   <div className="col-md-12">
          //     <p><span className="glyphicon glyphicon-asterisk lifespeedPink" style={{marginRight: '10', marginBottom: '10'}}></span>Denotes Required Fields</p>
          //   </div>
          // </div>
    return (
      <Modal onRequestHide={this.props.onRequestHide} bsStyle='default' title='Add Contact to your Circle of Trust' animation={true}>
        <hr className="center-block" style={{marginTop: -3, width: '95%'}}/>
        <div className='modal-body' style={{padding: '0px 20px'}}>
          <div className='row'>
            <div className='col-md-3'>
              <div style={{marginBottom: '10'}}>
                Profile Photo
              </div>

              <div>
                <img src={profilePhotoPreview} style={{width: '100', height: '100', marginBottom: '10'}}/>
              </div>

            </div>
            <div className='col-md-9'>

              <div className='fileUpload btn btn-primary'>
                <span>Choose Picture</span>
                  <input type='file' className='upload' ref='profilePhoto' onChange={this.convertFileToBase64}/>
              </div>

            </div>

          </div>

          <form >

            <div className='row'>
              <div className='col-md-6 col-sm-6'>
                <Input
                  type='text'
                  value={this.state.firstName}

                  hasFeedback
                  label='First Name'
                  ref='firstName'
                  onChange={this.handleChange} />
              </div>

              <div className='col-md-6 col-sm-6'>
                <Input
                  type='text'
                  value={this.state.lastName}
                  label='Last Name'

                  hasFeedback
                  ref='lastName'
                  onChange={this.handleChange} />
              </div>
            </div>

            <div className='row'>
              <div className='col-md-6 col-sm-6'>
                <Input
                  type='text'
                  value={this.state.relationship}


                  hasFeedback
                  label='Relationship'
                  ref='relationship'
                  onChange={this.handleChange} />
              </div>

              <div className='col-md-6 col-sm-6'>
                <Input
                  type='text'
                  value={this.state.title}

                  label='Organization'
                  ref='title'
                  onChange={this.handleChange} />
              </div>
            </div>

            <div className='row'>
              <div className='col-md-6 col-sm-6'>
                <Input
                  type='text'
                  value={this.state.address}

                  ref='address'
                  label='Address'
                  onChange={this.handleChange} />
              </div>

              <div className='col-md-6 col-sm-6'>
                <Input
                  type='text'
                  label='Address 2'
                  value={this.state.address2}

                  ref='address2'
                  onChange={this.handleChange} />
              </div>
            </div>

            <div className='row'>
              <div className='col-md-6 col-sm-6'>
                <Input
                  type='text'
                  value={this.state.city}

                  label='City'
                  ref='city'
                  onChange={this.handleChange} />
              </div>

              <div className='col-md-3 col-sm-3'>
                <Input
                  type='text'
                  value={this.state.state}

                  ref='state'
                  label='State'
                  maxLength='2'
                  onChange={this.handleChange} />
              </div>
              <div className='col-md-3 col-sm-3'>
                <Input
                  type='text'
                  value={this.state.zip}

                  label='Zip'
                  ref='zip'
                  onChange={this.handleChange} />
              </div>
            </div>

            <div className='row'>
              <div className='col-md-6 col-sm-6'>
                <Input
                  type='text'
                  value={this.state.phone}

                  ref='phone'
                  label='Phone Number'
                  onChange={this.handleChange} />
              </div>

              <div className='col-md-6 col-sm-6'>
                <Input
                  type='text'
                  value={this.state.mobile}

                  ref='mobile'
                  label='Mobile Number'
                  onChange={this.handleChange} />
              </div>
            </div>

            <div className='row'>
              <div className='col-md-6 col-sm-6'>
                <Input
                  type='text'
                  value={this.state.fax}

                  ref='fax'
                  label='Fax Number'
                  onChange={this.handleChange} />
              </div>

              <div className='col-md-6 col-sm-6'>
                <Input
                  type='text'
                  value={this.state.email}

                  ref='email'
                  label='Email Address'
                  onChange={this.handleChange} />
              </div>
            </div>
          </form>
        </div>
        <div className='modal-footer'>
          <ButtonToolbar className="pull-right">
            <Button onClick={this.props.onRequestHide}>Cancel</Button>
            <Button bsStyle='primary' onClick={this.handleSubmit} type='submit'>Save</Button>
          </ButtonToolbar>
        </div>
      </Modal>
    );
  }
});

module.exports = MyModal;

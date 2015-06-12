'use strict';
var React = require('react');
var manifestApi = require('../webapi/manifestApi.js');
var $ = require('jquery');
// var moment = require('moment');
// var urgentTag;
// var patientInfo;
// var pageLinks;

var PatientInfo = React.createClass({

  propTypes: {
    guid: React.PropTypes.string.isRequired
  },

  getInitialState: function() {
    return {
      requestingUserFirstName: '',
      requestingUserLastName: '',
      requestingUserMiddleName: '',
      requestingUserEmail: '',
      phone: '',
      profilePhoto: '',
      providerEmail: '',
      providerFirstName: '',
      providerLastName: '',
      providerType: '',
      urgent: '',
      dateOfBirth: ''
    };
  },

  componentDidMount: function() {
    var self = this;
    manifestApi.getRecordRequestDetails(this.props.guid, function(data){
      console.log(data);
      var profilePhoto;
      if (data.profilePhoto === undefined) {
        profilePhoto = '../../../images/ProfilePlaceholder.png';
      } else {
        profilePhoto = 'data:image/jpeg;charset=utf-8;base64,' + data.profilePhoto;
      }
      if (data) {
        self.setState({
          requestingUserFirstName: data.requestingUserFirstName,
          requestingUserLastName: data.requestingUserLastName,
          profilePhoto: profilePhoto,
          providerFirstName: data.providerFirstName || '',
          providerLastName: data.providerLastName || '',
          dateOfBirth: data.requestingUserDateOfBirth || ''
        });
        var requestingUserContactMethodList = $.parseJSON(data.requestingUserContactMethodList);
        console.log('requestingUserContactMethodLIst', requestingUserContactMethodList);
        $.each(requestingUserContactMethodList, function (index, value) {
          console.log(index);
          value = $.parseJSON(value);
          console.log(value);
          self.setState({
            phone: value.contactMethodValue
          });
        });
      }
    });
  },

  render: function() {
    console.log(this.state);
    return (
      <div>

        <div className='row'>

          <div className='col-md-2 col-sm-2 profileImageWrapper'>
            <img alt='profile image' className='img-circle' width='90' height='90'src={this.state.profilePhoto}/>
          </div>

          <div className='col-md-10 col-sm-10 patientInfoBox'>

            <div className='row patientNameDiv'>

              <div className='col-md-6 col-sm-6'>
              <p>First Name:
                <span className='patientName patientInfoText'>
                  {this.state.requestingUserFirstName}
                </span>
              </p>
              </div>

              <div className='col-md-6 col-sm-6'>
                <p className='lName'>
                  Last Name:
                  <span className='patientName patientInfoText'>
                    {this.state.requestingUserLastName}
                  </span>
                </p>
              </div>
            </div>

            <div className='textBoxDiv'>

            </div>

              <div className='row'>

                <div className='col-md-6 col-sm-6'>Date of Birth:
                  <span className='patientInfoText'>
                    {this.state.dateOfBirth}
                  </span>
                </div>

                <div className='col-md-6 col-sm-6'>Provider's Name:
                  <span className='patientInfoText'>
                    {this.state.providerFirstName + ' ' + this.state.providerLastName}
                  </span>
                </div>

              </div>

              <div className='row'>
                <div className='col-md-6'>Phone Number:
                  <span className='patientInfoText'>
                    {this.state.phone}
                  </span>
                </div>
              </div>
          </div>

        </div>

        <div className='row authLinkDiv'>
          <p>There is an
            <span className='authForm'> Authorized Medical Records Release Form</span>.
            Click <a href='#'>here</a> to read it.</p>
        </div>

      </div>
    );
  }

});

module.exports = PatientInfo;

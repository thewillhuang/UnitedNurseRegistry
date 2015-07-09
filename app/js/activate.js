'use strict';

var universalPost = require('../js/react/webapi/universalPost.js');
var vmasker = require('vanilla-masker');
var $ = require('jquery');

//Token Parser
var grabUrl = function(url, lastIndexStartString, lastIndexEndString) {
  var path = url;
  console.log(path);
  var startParseIndex = path.lastIndexOf(lastIndexStartString) + lastIndexStartString.length;
  var endParseIndex = path.lastIndexOf(lastIndexEndString);
  if (endParseIndex === -1) {
    endParseIndex = path.length;
  }
  return path.slice(startParseIndex, endParseIndex);
};

var grabToken = function() {
  return grabUrl(window.location.href, '?l=');
};

//login
var login = function(email) {
  var url = 'api/users/login';
  var payload = {
    'email': email,
    'password': $('#password2').val()
  };

  universalPost(payload, url, function(data) {
    console.log(data);
    if (data.Error) {
      window.swal('Could not login. Please try again');
    } else {
      sessionStorage.setItem('tokenKey', data.access_token);
      console.log(sessionStorage.getItem('tokenKey'));
      createUserProfileCompound();
    }
  });
};

//Activate User
var activateUser = function() {
  console.log('clicked signup');
  var url = 'api/users/activateuser';
  var payload = {
    'lifeline': grabToken(),
    'password': $('#password1').val(),
    'confirmPassword': $('#password2').val()
  };

  universalPost(payload, url, function(data) {
    console.log(data);
    login(data.email);
  });
};

//create profile
function createUserProfileCompound() {
  var url = 'api/profiles/createuserprofilecompound';

  //Profile
  var profile = {
    'firstName': $('#firstNameInput').val(),
    'middleName': '',
    'lastName': $('#lastNameInput').val(),
    'profileType': '',
    'avatarPath': $('input[name="sexradio"]:checked').val(),
    'dateOfBirth': $('#dob').val()
  };

  if (profile.avatarPath === 'Male') {
    profile.avatarPath = '/images/maleavatar.png';
  } else {
    profile.avatarPath = '/images/femaleavatar.png';
  }

  //Address
  var AddressList = {};
  var PrimaryAddress = {
    'label': 'Primary Address',
    'address': $('#address1Input').val(),
    'address2': $('#address2Input').val(),
    'city': $('#cityInput').val(),
    'state': $('#stateInput').val(),
    'zip': $('#zipInput').val()
  };

  AddressList.PrimaryAddress = JSON.stringify(PrimaryAddress);

  //ContactMethod
  var ContactMethodList = {};
  var Phone = {
    'label': 'Cell',
    'contactMethodValue': $('#phoneInput').val(),
    'contactMethodType': 'Phone'
  };



  ContactMethodList.Phone = JSON.stringify(Phone);

  var payload = {
    'Profile': JSON.stringify(profile),
    'AddressList': JSON.stringify(AddressList),
    'ContactMethodList': JSON.stringify(ContactMethodList)
  };

  universalPost(payload, url, function() {
    window.location.replace(window.GLOBAL_WEB_ROOT + 'pages/dashboard.html');
  });
}

$(function() {
  var handleClick = function() {
    var addressOkay = 0;
    var nameOkay = 0;
    var passwordOkay = 0;

    console.log($('#address1Input').val(), $('#cityInput').val(), $('#stateInput').val(), $('#zipInput').val());
    console.log($('#firstNameInput').val(), $('#lastNameInput').val(), $('#dob').val());
    if (
    $('#address1Input').val() &&
    $('#cityInput').val() &&
    $('#stateInput').val() &&
    $('#zipInput').val()
    ) {
      addressOkay = 1;
    } else {
      window.swal('need to fill out all address fields');
    }
    if (
      $('#firstNameInput').val() &&
      $('#lastNameInput').val() &&
      $('#dob').val()
    ) {
      nameOkay = 1;
    } else {
      window.swal('name and date of birth required');
    }
    if (
      $('#password1').val() &&
      $('#password2').val() &&
      $('#password1').val() === $('#password2').val()
    ) {
      passwordOkay = 1;
    } else {
      window.swal('password required and must match');
    }
    if (addressOkay && nameOkay && passwordOkay) {
      activateUser();
    }
  };

  $('#activateNewUser').click(function() {
    handleClick();
  });

  $('#password2').keypress(function(e) {
    if (e.which === 13) {
      handleClick();
      return false;
    }
  });

  vmasker(document.querySelector('#phoneInput')).maskPattern('(999) 999-9999');

});

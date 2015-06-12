'use strict';

//Toggle view
function showInvite() {
  $('#requestInvite').hide();
  $('#userRegister').show();
}

function hideOther() {
  $('#userRegister').hide();
  $('#forgotPassword').hide();
  $('#requestInvite').show();
}

function showForgotPassword() {
  $('#forgotPassword').show();
}

//Login
function login() {
  $('#loginBtn').attr('disabled', 'disabled');
  var newuri = API_ROOT + 'api/users/login';
  var payload = {
    'email': $('#userEmail').val(),
    'password': $('#userPassword').val()
  };
  $.ajax({
    type: 'POST',
    url: newuri,
    data: JSON.stringify(payload),
    dataType: 'json',
    contentType: 'application/json; charset=utf-8',
    success: function(data) {
      console.log('success', data);
      if (data.Error) {
        window.sweetAlert('Could not login. Check your email/password and try again.');
        console.log(newuri);
        $('#loginBtn').removeAttr('disabled');
      } else {
        sessionStorage.setItem('tokenKey', data.access_token);
        window.location.replace(GLOBAL_WEB_ROOT + 'pages/dashboard.html');
      }
    },
    error: function(data, success, error) {
      console.log('error', data, success, error);
      if (error === 'timeout')
      {
        window.sweetAlert('Could not reach Lifespeed Servers. Check your internet connection and try again.');
      }
      $('#loginBtn').removeAttr('disabled').html('Login');
      return false;
    },
    timeout: 3000
  });
}

//Register User
function registerUser(userEmail) {
  var newuri = API_ROOT + 'api/users/registeruser';
  var id = userEmail;

  $.getJSON(newuri + '/' + id + '/')
    .done(function(data) {
      console.log(data);
      if (data.Error !== null) {
        window.sweetAlert('Welcome! Check your email');
      } else {
        console.log(data.Success);
      }
    })
    .fail(function(jqXHR, textStatus, err) {
      console.log(err);
      return false;
    });
}

function forgotPassword() {
  var newuri = API_ROOT + 'api/users/forgotpassword';
  var id = $('.forgot-email').val();

  $.getJSON(newuri + '/' + id + '/')
    .done(function(data) {
      if (data.Error !== null) {
        window.sweetAlert('Email sent!');
        console.log(data);
        hideOther();
        return false;
      } else {
        hideOther();
        return false;
      }
    })
    .fail(function() {
      hideOther();
      showInvite();
    });
}

$(document).ready(function() {
  //Hide divs
  hideOther();
  //Remember me functionality
  if (localStorage.chkbx && localStorage.chkbx !== '') {
    $('#rememberMe').attr('checked', 'checked');
    $('#userEmail').val(localStorage.usrname);
    $('#UserPassword').val(localStorage.pass);
  } else {
    $('#rememberMe').removeAttr('checked');
    $('#userEmail').val('');
    $('#userPassword').val('');
  }
  $('#rememberMe').click(function() {

    if ($('#rememberMe').is(':checked')) {
      // save username and password
      localStorage.usrname = $('#userEmail').val();
      localStorage.pass = $('#userPassword').val();
      localStorage.chkbx = $('#rememberMe').val();
    } else {
      localStorage.usrname = '';
      localStorage.pass = '';
      localStorage.chkbx = '';
    }
  });

  //enter key event listener
  $('#userPassword').keypress(function(e){
    if (e.which === 13) {
      login();
      hideOther();
      return false;
    }
  });

  $('#userEmail').keypress(function(e){
    if (e.which === 13) {
      login();
      hideOther();
      return false;
    }
  });

  $('#resetEmailTextBox').keypress(function(e){
    if (e.which === 13) {
      forgotPassword();
      hideOther();
      return false;
    }
  });

  $('#registerNewUserTextBox').keypress(function(e){
    if (e.which === 13) {
      var userEmail = $('.register-email').val();
      registerUser(userEmail);
      hideOther();
      return false;
    }
  });

  //Handle click events
  $('#loginBtn').click(function(event) {
    event.preventDefault();
    login();
  });
  $('#requestInvite').click(function(event) {
    event.preventDefault();
    showInvite();
  });
  $('#registerNewUser').click(function(event) {
    event.preventDefault();
    var userEmail = $('.register-email').val();
    registerUser(userEmail);
    hideOther();
  });
  $('#forgotPasswordBtn').click(function(event) {
    event.preventDefault();
    hideOther();
    $('#requestInvite').hide();
    showForgotPassword();
    return false;
  });
  $('#resetEmail').click(function(event) {
    event.preventDefault();
    forgotPassword();
  });

});

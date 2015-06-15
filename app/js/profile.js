$(document).ready(function() {
  $("#updatePasswordForm").hide();
  // Check if new user - needs to fill out profile
  var newUser = sessionStorage.getItem("newUser");
  if (newUser === "true") {
    User.status = "new";
    $("#profilePhotoDiv").hide();
  } else {
    getProfileCompound();
  }
});

//
// Handle click events
//

$("#saveProfile").click(function(event) {
  event.preventDefault();
  if (User.status == "new") {
    getFormFields(function(done) {
      if (done) {
        validateRequired(function(done) {
          if (done) {
            createUserProfileCompound();
          } else {
            sweetAlert("Whoops!", "Please fill in all required fields!");
          }
        });
      }
    });
  } else {
    getFormFields(function(done) {
      if (done) {
        updateUser();
      }
    });
  }
});

// User information objects
var User = {
  status: '',
}
var Profile = {
  firstName: '',
  middleName: '',
  lastName: '',
  avatarPath: '',
  profilePhoto: '',
  height: '',
  weight: '',
  dateOfBirth: ''
}
var Address = {
  hasAddress: false,
  address: '',
  address2: '',
  city: '',
  state: '',
  zip: '',
  guid: ''
}
var Contact = {
    hasPhone: false,
    hasEmail: false,
    phone: '',
    altEmail: '',
    phoneGuid: '',
    emailGuid: ''
  }
  // Get form fields for profile
function getFormFields(callback) {
    Profile.firstName = $("#firstName").val();
    Profile.middleName = $("#middleName").val();
    Profile.lastName = $("#lastName").val();
    Profile.avatarPath = $('input[name="sexradio"]:checked').val();
    Profile.height = $("#height").val();
    Profile.weight = $("#weight").val();
    Profile.dateOfBirth = $("#dob").val();
    if (Profile.avatarPath == 'Male') {
      Profile.avatarPath = "/images/maleavatar.png";
    } else {
      Profile.avatarPath = "/images/femaleavatar.png";
    }
    Address.address = $("#address").val();
    Address.address2 = $("#address2").val();
    Address.city = $("#city").val();
    Address.state = $("#state").val();
    Address.zip = $("#zip").val();
    Contact.phone = $("#phone").val();
    Contact.altEmail = $("#altEmail").val();
    callback(true);
  }
  // Compound get user profile
function getProfileCompound() {
    var newuri = API_ROOT + 'api/profiles/getprofilecompound';
    var profileGuid = sessionStorage.getItem("activeProfile");
    var payload = {
      'profileGuid': profileGuid,
      'includePhoto': 'true'
    };
    ajaxPost(newuri, payload, function(data, done, message) {
      if (done) {
        // Pass data to function to fill profile fields
        fillProfile(data);
      } else {
        return false;
      }
    });
  }
  // Fill in profile fields with data
function fillProfile(data) {
    // Profile
    var profile = jQuery.parseJSON(data.Profile);
    $("#firstName").val(profile.firstName);
    $("#middleName").val(profile.middleName);
    $("#lastName").val(profile.lastName);
    $("#height").val(profile.height);
    $("#weight").val(profile.weight);
    $("#dob").val(profile.dateOfBirth);
    if (profile.profilePhoto){
      $("#profilePhotoPreview").attr("src", "data:image/jpeg;base64," + profile.profilePhoto);
    } else {
      $("#profilePhotoPreview").attr("src", "../images/ProfilePlaceholder.png");
    }
    $("#headerAvatar").attr("src", "data:image/jpeg;base64," + profile.profilePhoto);
    if (profile.avatarPath == "/images/femaleavatar.png") {
      $("#femaleRadio").attr("checked", true);
    } else {
      $("#maleRadio").attr("checked", true);
    }
    // Address
    var primaryAddress;
    var secondaryAddress;
    var addressList = jQuery.parseJSON(profile.addressList);
    if (addressList){
      $.each(addressList, function(index, value) {
        var address = jQuery.parseJSON(value);
        if (address['label'] == 'Primary Address') {
          primaryAddress = address;
        }
      });
      if (primaryAddress) {
        Address.hasAddress = true;
        Address.guid = primaryAddress.guid;
        $('#address').val(primaryAddress.address);
        $('#address2').val(primaryAddress.address2);
        $('#city').val(primaryAddress.city);
        $('#state').val(primaryAddress.state);
        $('#zip').val(primaryAddress.zip);
      }
    }
    // Contacts
    var cell;
    var alternateEmail;
    var contactMethodList = jQuery.parseJSON(profile.contactMethodList);
    if (contactMethodList){
      $.each(contactMethodList, function(index, value) {
        var contactMethod = jQuery.parseJSON(value);
        if (contactMethod['label'] == 'Cell') {
          Contact.hasPhone = true;
          cell = contactMethod;
          Contact.phoneGuid = cell.guid;
          $('#phone').val(cell.contactMethodValue);
        }
        if (contactMethod['label'] == 'Alternate Email') {
          Contact.hasEmail = true;
          alternateEmail = contactMethod;
          Contact.emailGuid = alternateEmail.guid;
          $("#altEmail").val(alternateEmail.contactMethodValue);
        }
      });
    }
  }
  // Compound create user profile
function createUserProfileCompound() {
  var newuri = API_ROOT + 'api/profiles/createuserprofilecompound';
  var profile = {
    'firstName': Profile.firstName,
    'middleName': Profile.middleName,
    'lastName': Profile.lastName,
    'avatarPath': Profile.avatarPath,
    'height': Profile.height,
    'weight': Profile.weight,
    'dateOfBirth': Profile.dateOfBirth
  };
  var AddressList = {};
  var PrimaryAddress = {
    'label': 'Primary Address',
    'address': Address.address,
    'address2': Address.address2,
    'city': Address.city,
    'state': Address.state,
    'zip': Address.zip
  };
  AddressList['PrimaryAddress'] = JSON.stringify(PrimaryAddress);
  if (Address.city && Address.state && Address.zip){
    Address.hasAddress = true;
  }
  var ContactMethodList = {};
  var Phone = {
    'label': 'Cell',
    'contactMethodValue': Contact.phone,
    'contactMethodType': 'Phone'
  };
  if (Contact.phone) {
    ContactMethodList['Phone'] = JSON.stringify(Phone);
    Contact.hasPhone = true;
  }
  var AlternateEmail = {
    'label': 'Alternate Email',
    'contactMethodValue': Contact.altEmail,
    'contactMethodType': 'Email'
  };
  if (Contact.altEmail) {
    ContactMethodList['AlternateEmail'] = JSON.stringify(AlternateEmail);
    Contact.hasEmail = true;
  }
  var payload = {
    'Profile': JSON.stringify(profile),
    'AddressList': JSON.stringify(AddressList),
    'ContactMethodList': JSON.stringify(ContactMethodList)
  };
  ajaxPost(newuri, payload, function(data, done, message) {
    if (done) {
      sessionStorage.setItem("newUser", "false");
      User.status = "";
      sessionStorage.setItem("activeProfile", data.guid);
      $("#profilePhotoDiv").show();
      sweetAlert("Created profile!");
    } else {
      return false;
    }
  });
}

function checkContacts() {
  if (Contact.hasEmail === true) {
    if (Contact.altEmail !== "") {
      updateContact(Contact.emailGuid, 'Email', Contact.altEmail);
    } else {
      deleteContact(Contact.emailGuid);
      Contact.hasEmail = false;
    }
    if (Contact.hasPhone === true) {
      if (Contact.phone !== "") {
        updateContact(Contact.phoneGuid, 'Cell', Contact.phone);
        sweetAlert("Profile Updated");
      } else {
        deleteContact(Contact.phoneGuid);
        Contact.hasPhone = false;
        sweetAlert("Profile Updated");
      }
    } else {
      if (Contact.phone !== "") {
        createContact('Cell', Contact.phone, 'Phone', function(done) {
          if (done) {
            Contact.hasPhone = true;
            sweetAlert("Profile Updated");
          }
        });
      }
    }
  } else {
    if (Contact.altEmail !== "") {
      createContact('Alternate Email', Contact.altEmail, 'Email', function(done) {
        if (done) {
          Contact.hasEmail = true;
          if (Contact.hasPhone === true) {
            if (Contact.hasPhone !== "") {
              updateContact(Contact.phoneGuid, 'Cell', Contact.phone);
              sweetAlert("Profile Updated");
            } else {
              deleteContact(Contact.phoneGuid);
              Contact.hasPhone = false;
              sweetAlert("Profile Updated");
            }
          } else {
            if (Contact.phone !== "") {
              createContact('Cell', Contact.phone, 'Phone', function(done) {
                if (done) {
                  Contact.hasPhone = true;
                  sweetAlert("Profile Updated");
                }
              });
            } else {
              sweetAlert("Profile Updated");
            }
          }
        }
      });
    } else {
      if (Contact.hasPhone === true) {
        if (Contact.phone !== "") {
          updateContact(Contact.phoneGuid, 'Cell', Contact.phone);
          sweetAlert("Profile Updated");
        } else {
          deleteContact(Contact.phoneGuid);
          Contact.hasPhone = false;
          sweetAlert("Profile Updated");
        }
      } else {
        if (Contact.phone !== "") {
          createContact('Cell', Contact.phone, 'Phone', function(done) {
            if (done) {
              Contact.hasPhone = true;
              sweetAlert("Profile Updated");
            }
          });
        } else {
          sweetAlert("Profile Updated");
        }
      }
    }
  }
}
// Update user
function updateUser() {
  getFormFields(function(done) {
    if (done) {
      updateProfile();
      if (Address.hasAddress === true) {
        if (Address.address && Address.city && Address.state){
          updateAddress();
          checkContacts();
        } else {
          deleteAddress(Address.guid);
          checkContacts();
        }
      } else {
        createAddress(function(done) {
          if (done) {
            checkContacts();
          }
        });
      }
    }
  });
}
// Create user address
function createAddress(callback) {
    var self = this;
    var profileGuid = sessionStorage.getItem("activeProfile");
    var newuri = API_ROOT + 'api/addresses/createaddress';
    var payload = {
      'profileGuid': profileGuid,
      'label': 'Primary Address',
      'address': Address.address,
      'address2': Address.address2,
      'city': Address.city,
      'state': Address.state,
      'zip': Address.zip
    };
    ajaxPost(newuri, payload, function(data, done, message) {
      if (done) {
        sessionStorage.setItem("activeAddress", data.guid);
        callback(true);
      } else {
        return false;
      }
    });
  }
  // Create contact
function createContact(label, methodValue, type, callback) {
    var self = this;
    var profileGuid = sessionStorage.getItem("activeProfile");
    var newuri = API_ROOT + 'api/contactmethods/createcontactmethod';
    var payload = {
      'profileGuid': profileGuid,
      'label': label,
      'contactMethodValue': methodValue,
      'contactMethodType': type
    };
    ajaxPost(newuri, payload, function(data, done, message) {
      if (done) {
        callback(true);
      } else {
        return false;
      }
    });
  }
  // Update existing profile
function updateProfile() {
    var profileGuid = sessionStorage.getItem("activeProfile");
    var newuri = API_ROOT + 'api/profiles/updateprofile';
    var payload = {
      'profileGuid': profileGuid,
      'firstName': Profile.firstName,
      'middleName': Profile.middleName,
      'lastName': Profile.lastName,
      'avatarPath': Profile.avatarPath,
      'profilePhoto': Profile.profilePhoto,
      'height': Profile.height,
      'weight': Profile.weight,
      'dateOfBirth': Profile.dateOfBirth
    };
    ajaxPost(newuri, payload, function(data, done, message) {
    });
  }
  // Update contact
function updateContact(contactGuid, contactType, contactMethodValue) {
    var profileGuid = sessionStorage.getItem("activeProfile");
    var newuri = API_ROOT + 'api/contactmethods/updatecontactmethod';
    var contactGuid;
    if (contactType == "Email") {
      contactGuid = Contact.emailGuid;
    } else {
      contactGuid = Contact.phoneGuid;
    }
    var payload = {
      'profileGuid': profileGuid,
      'contactMethodGuid': contactGuid,
      'contactMethodValue': contactMethodValue,
      'contactMethodType': contactType
    };
    ajaxPost(newuri, payload, function(data, done, message) {});
  }
  // Update address
function updateAddress() {
    var profileGuid = sessionStorage.getItem("activeProfile");
    var addressGuid = Address.guid;
    var newuri = API_ROOT + 'api/addresses/updateaddress';
    var payload = {
      'profileGuid': profileGuid,
      'addressGuid': addressGuid,
      'address': Address.address,
      'address2': Address.address2,
      'city': Address.city,
      'state': Address.state,
      'zip': Address.zip
    };
    ajaxPost(newuri, payload, function(data, done, message) {});
  }
// Delete contact
function deleteContact(contactGuid) {
  var newuri = API_ROOT + 'api/contactmethods/deletecontactmethod';
  var profileGuid = sessionStorage.getItem("activeProfile");
  var payload = {
      'profileGuid': profileGuid,
      'contactMethodGuid': contactGuid
  };
  ajaxPost(newuri, payload, function(data, done, message){
  });
}
// Delete Address
function deleteAddress(addressGuid) {
  var newuri = API_ROOT + 'api/addresses/deleteaddress';
  var profileGuid = sessionStorage.getItem("activeProfile");
  var payload = {
      'profileGuid': profileGuid,
      'addressGuid': addressGuid
  };
  ajaxPost(newuri, payload, function(data, done, message){
    if (done){
      $("#address").val("");
      $("#address2").val("");
      $("#city").val("");
      $("#state").val("");
      $("#zip").val("");
    }
  });
}
  // Profile photo image preview
function PreviewImage() {
    var oFReader = new FileReader();

    oFReader.readAsDataURL(document.getElementById("profilePhotoUpload").files[0]);

    oFReader.onload = function(oFREvent) {
      document.getElementById("profilePhotoPreview").src = oFREvent.target.result;
      var profilePhoto = oFREvent.target.result;
      Profile.profilePhoto = profilePhoto.split(',').pop();
      uploadProfilePhoto(Profile.profilePhoto);
    };
  }
  // Upload profile photo
function uploadProfilePhoto() {
    var newuri = API_ROOT + 'api/profiles/uploadprofilephoto';
    var profileGuid = sessionStorage.getItem("activeProfile");
    var photoData = Profile.profilePhoto;
    var payload = {
      'profileGuid': profileGuid,
      'photoData': photoData
    }
    ajaxPost(newuri, payload, function(data, done, message) {});
  }
  // Update existing user password
function updatePassword() {
  var newuri = API_ROOT + 'api/users/updateexistingpassword';
  var payload = {
    'oldPassword': $('#oldPassword').val(),
    'newPassword': $('#newPassword').val(),
    'confirmNewPassword': $('#newPasswordMatch').val()
  };

  ajaxPost(newuri, payload, function(data, done, message) {
    if (done) {
      sweetAlert("Sucess!", "Your password has been udpated");
    } else {
      return false;
    }
  });
}

// Update user password submit button
$("#btnUpdatePassword").click(function(event) {
  event.preventDefault();
  updatePassword();
});
// Delete profile photo x
$(".delete-profile-photo").click(function(){

});
// Profile and update password tabs
$("#activePasswordTab").click(function(event) {
  event.preventDefault();
  $(this).parent(".profile-link").addClass("active-profile-link");
  $("#activeProfileTab").parent(".profile-link").removeClass("active-profile-link");
  $("#userAccessSettings").parent(".profile-link").removeClass("active-profile-link");
  $("#profileForm").hide();
  $("#updatePasswordForm").show();
  $("#userAccessSettingsComponent").hide();
});
$("#activeProfileTab").click(function(event) {
  event.preventDefault();
  $(this).parent(".profile-link").addClass("active-profile-link");
  $("#activePasswordTab").parent(".profile-link").removeClass("active-profile-link");
  $("#userAccessSettings").parent(".profile-link").removeClass("active-profile-link");
  $("#profileForm").show();
  $("#updatePasswordForm").hide();
  $("#userAccessSettingsComponent").hide();
});
//user access settings
$("#userAccessSettings").click(function(event) {
  event.preventDefault();
  $(this).parent(".profile-link").addClass("active-profile-link");
  $("#activeProfileTab").parent(".profile-link").removeClass("active-profile-link");
  $("#activePasswordTab").parent(".profile-link").removeClass("active-profile-link");
  $("#profileForm").hide();
  $("#userAccessSettingsComponent").show();
  $("#updatePasswordForm").hide();
});

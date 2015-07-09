$(document).ready(function() {
  // Initialize draggable widget functionality
  PortletDraggable.init();
  // Setup user dashboard
  loadReturnUserDashboard();
  // Avatar Widget Dropzone
  var token = sessionStorage.getItem("tokenKey");
  var headers = {};
  if (token) {
    headers.Authorization = 'Bearer ' + token;
    headers.Payload = JSON.stringify({
      profileGuid: sessionStorage.getItem("activeProfile"),
      type: 'personal'
    });
  }

  //Initialize tooltips
  $("a").tooltip();
  $("#body").tooltip();

});

//Init localization example
// $(function(){
//   var opts = { language: "sp", pathPrefix: "../../localization", skipLanguage: "en-US" };
//   $("[data-localize]").localize("navbars", opts).localize("dashboard", opts)
// });

//Global variables
var counter = 0;

//Load up user dashboard process
function loadReturnUserDashboard() {
  //Get default user profile - if none, redirects to profile form
  getUserDefaultProfile(function(loadedProfile) {
    if (loadedProfile) {
      Portlets.getDashboardColumns(function(gotColumns) {
        if (gotColumns) {
          Portlets.getEachColumn();
          fillAvatarPortlet();
          fillGalleryPortlet();
          fillBoardPortlet();
          // Glimpse.fillGlimpsePortlet();
        } else {
          // If user doesn't have saved column arrangement ... Place preset arrangement and create columns
          Portlets.placePortlets(function(placedPortlets) {
            if (placedPortlets) {
              Portlets.createDashboardColumn(1, Portlets.portletCol1, function(done) {
                if (done) {
                  Portlets.createDashboardColumn(2, Portlets.portletCol2, function(done) {
                    if (done) {
                      Portlets.createDashboardColumn(3, Portlets.portletCol3, function(done) {
                        //console.log("done creating columns");
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
    } else {
      window.location.replace("profile.html");
    }
  });
}
// Find max height able to scale avatar svgs to based on user screen height
function adjustAvatar(){
  var windowHeight = window.innerHeight;
  var maxHeight = windowHeight - 170;
  $(".upload-body-img").css("max-height", maxHeight + "px");
}

//Get default profile
function getUserDefaultProfile(callback) {
  var token = sessionStorage.getItem("tokenKey");
  var newuri = API_ROOT + 'api/profiles/getuserdefaultprofile';
  var payload = {
    'includePhoto': 'true'
  }
  ajaxPost(newuri, payload, function(data, done, message) {
    if (done && data.firstName) {
      sessionStorage.setItem("activeProfile", data.guid);
      sessionStorage.setItem("newUser", "false");
      $("#userFirstName").text(data.firstName);
      console.log(data.avatarPath);
      if (data.avatarPath == '/images/femaleavatar.png'){
        $("#userBodyAvatar").attr("src", '/images/female.svg');
      } else {
        $("#userBodyAvatar").attr("src", '/images/male.svg');
      }
      if (data.profilePhoto) {
        $("#headerAvatar").attr("src", "data:image/jpeg;base64," + data.profilePhoto);
        $("#sidebarAvatar").attr("src", "data:image/jpeg;base64," + data.profilePhoto);
      }
      adjustAvatar();
      callback(true);
    } else {
      sessionStorage.setItem("newUser", "true");
      callback(false);
    }
  });
}
//Portlet object
var Portlets = {

    col1Guid: '',
    col2Guid: '',
    col3Guid: '',
    portletCol1: '',
    portletCol2: '',
    portletCol3: '',
    dashboardColumnGuids: '',

    getDashboardColumns: function(callback) {
      var self = this;
      var newuri = API_ROOT + 'api/dashboardcolumns/getprofiledashboardcolumns';
      var profileGuid = sessionStorage.getItem("activeProfile");
      var payload = {
        'profileGuid': profileGuid
      };
      ajaxPost(newuri, payload, function(data, done, message) {
        $(".circle-portlet").attr("id", "circlePortlet");
        if (done && data.dashboardColumnList) {
          self.dashboardColumnGuids = $.parseJSON(data.dashboardColumnList);
          callback(true);
        } else {
          //console.log("No saved columns");
          var portletCol1 = "avatarPortlet,emptyPortlet1,";
          var portletCol2 = "sharePortlet,circlePortlet,imageGalleryPortlet,emptyPortlet2,";
          var portletCol3 = "boardPortlet,emptyPortlet3,";
          self.portletCol1 = portletCol1;
          self.portletCol2 = portletCol2;
          self.portletCol3 = portletCol3;
          sessionStorage.setItem("portletCol1", portletCol1);
          sessionStorage.setItem("portletCol2", portletCol2);
          sessionStorage.setItem("portletCol3", portletCol3);
          callback(false);
        }
      });
    },
    getEachColumn: function() {
      var self = this;
      var columns = self.dashboardColumnGuids;
      for (i in columns) {
        self.getDashboardColumn(columns[i]);
      }
    },
    getDashboardColumn: function(columnGuid) {
      var self = this;
      var newuri = API_ROOT + 'api/dashboardcolumns/getdashboardcolumn';
      var profileGuid = sessionStorage.getItem("activeProfile");
      var payload = {
        'profileGuid': profileGuid,
        'dashboardColumnGuid': columnGuid
      };
      ajaxPost(newuri, payload, function(data, done, message) {
        if (done && data) {
          //console.log(data);
          counter++;
          if (data.columnPosition === "1") {
            sessionStorage.setItem("portletCol1", data.columnData);
            self.portletCol1 = data.columnData;
            self.col1Guid = columnGuid;
          } else if (data.columnPosition === "2") {
            sessionStorage.setItem("portletCol2", data.columnData);
            self.portletCol2 = data.columnData;
            self.col2Guid = columnGuid;
          } else {
            sessionStorage.setItem("portletCol3", data.columnData);
            self.portletCol3 = data.columnData;
            self.col3Guid = columnGuid;
          }
          if (counter == 3) {
            Portlets.placePortlets(function(done) {
              if (done) {
                //console.log("Placed portlets after getting column data");
              }
            });
          }
        } else {
          return false;
        }
      });
    },
    createDashboardColumn: function(columnNum, columnData, callback) {
      var self = this;
      var newuri = API_ROOT + 'api/dashboardcolumns/createdashboardcolumn';
      var profileGuid = sessionStorage.getItem("activeProfile");
      var payload = {
        'profileGuid': profileGuid,
        'columnPosition': columnNum,
        'columnData': columnData
      };
      ajaxPost(newuri, payload, function(data, done, message) {
        if (done) {
          if (columnNum == 1) {
            Portlets.col1Guid = data.guid;
          } else if (columnNum == 2) {
            Portlets.col2Guid = data.guid;
          } else {
            Portlets.col3Guid = data.guid;
          }
        } else {
          return false;
        }
        callback(true);
      });
    },
    //Append their widgets to the dashboard
    placePortlets: function(callback) {
      var self = this;
      var portletCol1 = sessionStorage.getItem("portletCol1");
      var portletCol2 = sessionStorage.getItem("portletCol2");
      var portletCol3 = sessionStorage.getItem("portletCol3");
      var portletCol1Arr = portletCol1.split(',');
      var portletCol2Arr = portletCol2.split(',');
      var portletCol3Arr = portletCol3.split(',');

      $.each(portletCol1Arr, function(index, value) {
        $('#col1').append($('#' + value));
      });
      $.each(portletCol2Arr, function(index, value) {
        $('#col2').append($('#' + value));
      });
      $.each(portletCol3Arr, function(index, value) {
        $('#col3').append($('#' + value));
      });
      callback(true);
    },
    updateDashboardColumn: function(columnGuid, columnNum, columnData) {
      var self = this;
      if (columnNum == 1) {
        self.portletCol1 = columnData;
      } else if (columnNum == 2) {
        self.portletCol2 = columnData;
      } else {
        self.portletCol3 = columnData;
      }
      var newuri = API_ROOT + 'api/dashboardcolumns/updatedashboardcolumn';
      var profileGuid = sessionStorage.getItem("activeProfile");
      var payload = {
        'profileGuid': profileGuid,
        'dashboardColumnGuid': columnGuid,
        'columnPosition': columnNum,
        'columnData': columnData
      };
      ajaxPost(newuri, payload, function(data, done, message) {
        if (done) {
          //console.log("done updating column");
        } else {
          //console.log("failed to update column");
        }
      });
    }
  }
  //Init portlets(widgets) with drag&drop functionality
var PortletDraggable = function() {
  var self = this;
  return {
    init: function() {
      if (!jQuery().sortable) {
        return;
      }
      $("#sortable_portlets").sortable({
        connectWith: ".portlet",
        items: ".portlet",
        opacity: 0.8,
        //necessary to allow update ajax to run before triggering update again - make this less if app is running well
        delay: 600,
        coneHelperSize: true,
        placeholder: 'portlet-sortable-placeholder',
        forcePlaceholderSize: true,
        tolerance: "pointer",
        helper: "clone",
        tolerance: "pointer",
        forcePlaceholderSize: !0,
        helper: "clone",
        cancel: ".portlet-sortable-empty, .portlet-fullscreen", // cancel dragging if portlet is in fullscreen mode
        revert: 250, // animation in milliseconds
        //Check for moved portlets(widgets) and update user list
        update: function(event, ui) {
          if (ui.item.prev().hasClass("portlet-sortable-empty")) {
            ui.item.prev().before(ui.item);
          }
          var portletsUpdate1 = "";
          var portletsUpdate2 = "";
          var portletsUpdate3 = "";
          //Create string of portlet ids to save, by column, after a portlet is moved
          $('.portlet').each(function(i) {
            var portletId = $(this).attr("id");
            var colId = $(this).parent(".col-md-4").attr("id");

            if (colId === "col1") {
              portletsUpdate1 += portletId + ",";
            } else if (colId === "col2") {
              portletsUpdate2 += portletId + ",";
            } else if (colId === "col3") {
              portletsUpdate3 += portletId + ",";
            } else {
              //console.log("couldnt identify columnNum on update");
            }
          });
          Portlets.updateDashboardColumn(Portlets.col1Guid, 1, portletsUpdate1);
          Portlets.updateDashboardColumn(Portlets.col2Guid, 2, portletsUpdate2);
          Portlets.updateDashboardColumn(Portlets.col3Guid, 3, portletsUpdate3);
          // $("#sortable_portlets").disableSelection();
        }
      });
    }
  }
}();

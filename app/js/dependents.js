$(document).ready(function(){

  setUpDependentModal();

});

function setUpDependentModal(){
  $("#nonUserForm").show();
  $("#isUserForm").hide();
  $("#depNonUserLink").addClass("active-dependent-link");
  $("#depUserLink").removeClass("active-dependent-link");
}

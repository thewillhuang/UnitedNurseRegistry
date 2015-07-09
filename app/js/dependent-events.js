$("#addDependentBtn").click(function(){
  $("#addDependentModal").modal('show');
});


$("#depUserLink").click(function(){
  $(this).toggleClass("active-dependent-link");
  $("#depNonUserLink").toggleClass("active-dependent-link");
  if ($(this).hasClass("active-dependent-link")){
    $("#nonUserForm").hide();
    $("#isUserForm").show();
  } else {
    $("#nonUserForm").show();
    $("#isUserForm").hide();
  }
});

$("#depNonUserLink").click(function(){
  $(this).toggleClass("active-dependent-link");
  $("#depUserLink").toggleClass("active-dependent-link");
  if ($(this).hasClass("active-dependent-link")){
    $("#nonUserForm").show();
    $("#isUserForm").hide();
  } else {
    $("#nonUserForm").hide();
    $("#isUserForm").show();
  }
});

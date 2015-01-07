Meteor.startup(function() {
  toastr.options.positionClass = "toast-bottom-left";
});

Template.registerHelper('user_email', function() {
  return ((Meteor.userId() == null) ? 'no email to show' : Meteor.user().emails[0].address);
});

Meteor.startup(function() {
  toastr.options.positionClass = "toast-bottom-left";
});

Template.registerHelper('user_email', function() {
  return ((Meteor.userId() == null) ? 'no email to show' : Meteor.user().emails[0].address);
});

Template.loginnav.rendered = function() {
  Session.set('login_hasoptions', false);
}

Template.loginnav.helpers({
  'has_options': function() {
    Meteor.call('getPermissions', function(err, ret) {
      if (err != undefined) {return;}
      if (ret.admin && (ret.grant || ret.dean || ret.house)) {
        Session.set('login_hasoptions', true);
        return;
      }
      Session.set('login_hasoptions', false);
    })
    return Session.get('login_hasoptions');
  }
});

Template.loginnav.events({
  'click #logout': function() {
    Meteor.logout();
    Router.go('login');
  }
});

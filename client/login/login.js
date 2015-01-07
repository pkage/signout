Template.login.events({
  'click #login, keydown input': function(ev,tm) {
    //ev.preventDefault();
    if (ev.type == 'keydown' && ev.which != 13) {
    //  console.log('dropped event');
      return;
    }
    var em = $('#login-email').val();
    var pw = $('#login-password').val();
    if (em == "" || pw == "") {
      toastr.error('Make sure you\'ve filled out both an email and a password.', 'Invalid email or password!');
      return;
    }
    if (!Meteor.status().connected) {
      toastr.error('no connection to server.');
      return;
    }
    Meteor.call('checkRepeatedEmail', em, function(err, ret) {
      if (!ret) {
        toastr.error('that doesn\' appear to be a registered email');
      }
      console.log(em + pw);
    });
  }
});

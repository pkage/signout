var getRole = function(id) {
  ref = Roles.findOne({ref: id});
  if (ref != undefined) {
    return ref.role;
  }
  return 'student';
}

Meteor.publish('slips', function() {
  if (getRole(Meteor.userId()) == "dean") {
    return Slips.find();
  } else {
    return Slips.find({student: Meteor.userId()});
  }
});

Meteor.startup(function() {
   process.env.MAIL_URL = 'smtp://postmaster%40kagelabs.org:59aa132fae6a802044629ab58b8dce3b@smtp.mailgun.org:587';

});

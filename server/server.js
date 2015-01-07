
Meteor.methods({
  checkRepeatedEmail: function(emailtotest) { // check if the email exists in the database
    var numOfCollisions = Meteor.users.find({'emails': {$elemMatch: {'address': emailtotest}}}).count();
    console.log('Email collisions for "' + emailtotest + '": ' + numOfCollisions);
    return (numOfCollisions > 0); // true if there is a collision
  },
  'getPermissions': function() { // get the permissions object for the user
    return getPermissions(Meteor.userId());
  },
  'getPermissionsFor': function(usr) { // get permissions object for an arbitrary user
    return getPermissionsFor(usr);
  },
  'addDorm': function(dormName) {
    if (!getPermissions(Meteor.userId()).admin) {
      throw new Meteor.Error('unauthorized', 'The user doesn\'t have permission to do this.');
    }
    if (dormName == '') {
      throw new Meteor.Error('emptyargument', "Your argument is empty when it shouldn't be.")
    }
    Dorms.insert({
      name: dormName,
      advisors: []
    });
  },
  'removeDorm': function(dorm_id) {
    if (!getPermissions(Meteor.userId()).admin) {
      throw new Meteor.Error('unauthorized', 'The user doesn\'t have permission to do this.');
    }
    Dorms.remove({_id: dorm_id});
  }
});

getPermissions = function(user_id) {
  if (user_id != null && Roles.find({affects: Meteor.userId()}).count() > 0) {
    return Roles.findOne({affects: user_id}).permissions;
  }
  return {admin: false, dean: false, grant: false, house: false};
}

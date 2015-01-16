
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
      throw new Meteor.Error('emptyargument', "Your argument is empty when it shouldn't be.");
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
  },
  'checkForApplicableRoles': function() {
    if (Meteor.userId() == null) {
      throw new Meteor.Error('notloggedin', "The user isn't logged in.");
    }
    if (Roles.find({email: Meteor.user().emails[0].address}).count() > 0) {
      Roles.update({email: Meteor.user().emails[0].address}, {$set: {affects: Meteor.userId()}});
      return true; // a new role
    }
    return false; // no new roles
  },
  'createRole': function(role) {
    if (!getPermissions(Meteor.userId()).admin) {
      throw new Meteor.Error('unauthorized', 'The user doesn\'t have permission to do this.');
    }
    if (role == undefined) {
      throw new Meteor.Error('emptyargument', "Your argument is empty when it shouldn't be.");
    }
    Roles.insert(role);
  },
  'updateRole': function(role) {
    if (!getPermissions(Meteor.userId()).admin) {
      throw new Meteor.Error('unauthorized', 'The user doesn\'t have permission to do this.');
    }
    if (role == undefined) {
      throw new Meteor.Error('emptyargument', "Your argument is empty when it shouldn't be.");
    }
    Roles.update({_id: role._id}, {$set: {
      name: role.name,
      email: role.email,
      permissions: role.permissions
    }});
  },
  'removeRole': function(roleid) {
    if (!getPermissions(Meteor.userId()).admin) {
      throw new Meteor.Error('unauthorized', 'The user doesn\'t have permission to do this.');
    }
    if (roleid == undefined) {
      throw new Meteor.Error('emptyargument', "Your argument is empty when it shouldn't be.");
    }

    Roles.remove({_id: roleid});
  },
  'addAdvisorToDorm': function(dormid, advisoremail) {
    var pobj = getPermissions(Meteor.userId());
    if (!pobj.admin && !pobj.house) {
      throw new Meteor.Error('unauthorized', 'The user doesn\'t have permission to do this.');
    }

    if (dormid == undefined || advisoremail == undefined) {
      throw new Meteor.Error('emptyargument', "Your argument is empty when it shouldn't be.");
    }
    if (Dorms.find({_id: dormid}).count() < 1) {
      throw new Meteor.Error('invalidargument', "Your argument is invalid.");
    }
    if (Roles.find({email: advisoremail}).count() < 1) {
      throw new Meteor.Error('invalidargument', "Your argument is invalid.");
    }
    if (!Roles.find({email: advisoremail}).fetch()[0].permissions.house) {
      throw new Meteor.Error('unauthorized', 'The user doesn\'t have permission to do this.');
    }
    if ((pobj.house && !pobj.admin) && Roles.find({email: advisoremail}).fetch()[0].affects != Meteor.userId()) {
      throw new Meteor.Error('unauthorized', 'The user doesn\'t have permission to do this.');
    }
    Dorms.update({_id: dormid}, {$push: {advisors: advisoremail}});
    return Dorms.find({_id: dormid}).fetch()[0].advisors;
  },
  'removeAdvisorFromDorm': function(dormid, advisoremail, index) {
    var pobj = getPermissions(Meteor.userId());
    if (!pobj.admin && !pobj.house) {
      throw new Meteor.Error('unauthorized', 'The user doesn\'t have permission to do this.');
    }

    if (dormid == undefined || advisoremail == undefined || index == undefined) {
      throw new Meteor.Error('emptyargument', "Your argument is empty when it shouldn't be.");
    }
    if (Dorms.find({_id: dormid}).count() < 1) {
      throw new Meteor.Error('invalidargument', "Your argument is invalid.");
    }
    var advs = Dorms.findOne({_id: dormid}).advisors;
    if ((pobj.house && !pobj.admin) && Roles.findOne({email: advs[index]}).affects != Meteor.userId()) {
      throw new Meteor.Error('unauthorized', 'The user doesn\'t have permission to do this.');
    }
    advs.splice(index, 1);
    Dorms.update({_id: dormid}, {$set: {advisors: advs}}); // delightfully nonatomic.
    return advs;
  },
  'createSlip': function(obj) {
    var pobj = getPermissions(Meteor.userId());
    if (!pobj.dean) {
      throw new Meteor.Error('unauthorized', 'The user doesn\'t have permission to do this.');
    }
    if (obj == undefined) {
      throw new Meteor.Error('invalidargument', "Your argument is invalid.");
    }
    Slips.insert(obj);
  },
  'updateSlip': function(obj) { // TODO: Fix permissions
    if (obj == undefined) {
      throw new Meteor.Error('invalidargument', "Your argument is invalid.");
    }
    var id = obj._id; delete obj['_id'];
    Slips.update({_id: id}, obj);
  }
});

getPermissions = function(user_id) {
  if (user_id != null && Roles.find({affects: Meteor.userId()}).count() > 0) {
    return Roles.findOne({affects: user_id}).permissions;
  }
  return {admin: false, dean: false, grant: false, house: false};
}

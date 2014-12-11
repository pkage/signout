Template.menu.helpers = {
  'role': function() {
    ref = Roles.findOne({ref: Meteor.userId()});
    if (ref != undefined) {
      return ref.role;
    }
    return 'student';
  }
}

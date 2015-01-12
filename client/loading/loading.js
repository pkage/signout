Template.loading.rendered = function() {
  Meteor.call('checkForApplicableRoles', function(err, ret) {
    Meteor.call('getPermissions', function(err, ret) {
      if (ret != undefined) {
        console.log(ret);
        if (ret.admin) {
          Router.go('admin'); return;
        }
        if (ret.grant || ret.dean || ret.house) {
          Router.go('faculty'); return;
        }
        Router.go('student'); return;
      }
    });
  });
}

Template.adminnav.rendered = function() {
  Session.set('na_selected', 'dorms');
  $.material.init();
}

Template.adminnav.events({
  'click #na_dorms_button': function() {
    Session.set('na_selected', 'dorms');
  },
  'click #na_roles_button': function() {
    Session.set('na_selected', 'roles');
  }
});

Template.adminnav.helpers({
  'na_dorms_v': function() {
    return (Session.get('na_selected') == 'dorms');
  },
  'na_roles_v': function() {
    return (Session.get('na_selected') == 'roles');
  }
});

Template.admin.rendered = function() {
  if (Meteor.userId() == null) {Router.go('login');}
  Meteor.call('getPermissions', function(err,ret) {
    if (err != undefined) {
      return;
    }
    if (!ret.admin) {
      Router.go('loading');
    }
  });
}


Template.admin.helpers({
  'na_dorms_v': function() {
    return (Session.get('na_selected') == 'dorms');
  },
  'na_roles_v': function() {
    return (Session.get('na_selected') == 'roles');
  }
});

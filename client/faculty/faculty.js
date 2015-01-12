Template.navigationfaculty.rendered = function() {
  Session.set('nf_selected', 'overview');
  $.material.init();
}

Template.navigationfaculty.events({
  'click #nf_overview_button': function() {
    Session.set('nf_selected', 'overview');
  },
  'click #nf_dorms_button': function() {
    Session.set('nf_selected', 'dorms');
  },
  'click #nf_deansoffice_button': function() {
    Session.set('nf_selected', 'deansoffice');
  }
});

Template.navigationfaculty.helpers({
  'nf_overview_active': function() {return ((Session.get('nf_selected') == 'overview') ? 'active' : '' );},
  'nf_dorms_active': function() {return ((Session.get('nf_selected') == 'dorms') ? 'active' : '' );},
  'nf_deansoffice_active': function() {return ((Session.get('nf_selected') == 'deansoffice') ? 'active' : '' );},
});

Template.faculty.rendered = function() {
  if (Meteor.userId() == null) {Router.go('login');}
  Meteor.call('getPermissions', function(err,ret) {
    if (err != undefined) {
      return;
    }
    if (!(ret.house || ret.grant || ret.dean)) {
      Router.go('loading');
    }
  });
}

Template.faculty.helpers({
  'nf_overview_v': function() {
    return (Session.get('nf_selected') == 'overview');
  },
  'nf_dorms_v': function() {
    return (Session.get('nf_selected') == 'dorms');
  },
  'nf_deansoffice_v': function() {
    return (Session.get('nf_selected') == 'deansoffice');
  },
  'nf_joinadorm_v': function() {
    return (Session.get('nf_selected') == 'joinadorm');
  }
});

Template.na_roles.rendered = function() {
  $.material.init();
}

Template.na_roles.helpers({
  'roles': function() {
    return Roles.find({});
  },
  'permissions_pretty': function() {
    var res = "{";
    res += ((this.permissions.admin) ? 'A, ' : '-, ');
    res += ((this.permissions.dean) ? 'D, ' : '-, ');
    res += ((this.permissions.grant) ? 'G, ' : '-, ');
    res += ((this.permissions.house) ? 'H' : '-');
    return res + "}";
  },
  'selectedrole': function() {
    return Session.get('selectedrole');
  }
});

Template.na_roles.events({
  'click #openroleconfigmodal': function() {
    Session.set('selectedrole', this);
    $.material.init();
    $('#editrole_fullname').val(this.name);
    $('#editrole_email').val(this.email);
    for (var key in this.permissions) {
      if (this.permissions.hasOwnProperty(key)) {
        $('#editrole_c_' + key).prop('checked', this.permissions[key]);
      }
    }
    $('#roleconfigmodal').modal();
  },
  'click #addrole': function() {
    var role = {
      name: $('#addrole_fullname').val(),
      email: $('#addrole_email').val(),
      permissions: {
        admin: $('#addrole_c_admin').is(':checked'),
        dean: $('#addrole_c_dean').is(':checked'),
        grant: $('#addrole_c_grant').is(':checked'),
        house: $('#addrole_c_house').is(':checked')
      }
    }
    if (role.name == "" || role.email == "") {
      toastr.warning('You need both a name and an email.', 'You can\'t do that!');
      return;
    }
    if (!Meteor.status().connected) {
      toastr.error('No connection to server.');
    }
    Meteor.call('createRole', role, function(err) {
      if (err == undefined) {
        $('input').val('');
        $(':checkbox').prop('checked', false);
      }
    });
  },
  'click #editrole_save': function() {
    var role = {
      name: $('#editrole_fullname').val(),
      email: $('#editrole_email').val(),
      permissions: {
        admin: $('#editrole_c_admin').is(':checked'),
        dean: $('#editrole_c_dean').is(':checked'),
        grant: $('#editrole_c_grant').is(':checked'),
        house: $('#editrole_c_house').is(':checked')
      },
      _id: this._id
    }
    if (role.name == "" || role.email == "") {
      toastr.warning('You need both a name and an email.', 'You can\'t do that!');
      return;
    }
    if (!Meteor.status().connected) {
      toastr.error('No connection to server.');
    }
    Meteor.call('updateRole', role, function(err) {
      if (err == undefined) {
        $('input').val('');
        $(':checkbox').prop('checked', false);
        $('#roleconfigmodal').modal('hide');
      }
    });
  },
  'click #editrole_remove': function() {
    Meteor.call('removeRole', this._id, function(err) {
      if (err != undefined) {
        toastr.error(err.reason, err.error);
        return;
      } else {
        $('#roleconfigmodal').modal('hide');
      }
    });
  }
});

Template.na_dorms.helpers({
  'dorm': function() {
    return Dorms.find({});
  },
  'count': function() {
    return Slips.find({dorm: this._id}).count();
  },
  'has_advisors': function() {
    return (this.advisors.length > 0);
  },
  'dormsettings_selected': function() {
    return Session.get('dormsettings_selected');
  }
});

Template.na_dorms.events({
  'submit #addadorm_form, click #addtodb': function(ev, tm) {
    ev.preventDefault();
    Meteor.call('addDorm', $('#addadorm').val(), function(err) {
      if (err == undefined) {
        $('#addadorm').val('');
        return;
      }
      if (err.error == "unauthorized") {
        toastr.error("You don't have permission to do this!", 'An error occured!');
        return;
      }
      if (err.error == "emptyargument") {
        toastr.warning("You need to give the dorm a name!", "You can't do that!");
        return;
      }
      toastr.error(err.reason, err.error);
    });
  },
  'click #opendormsettings': function() {
    Session.set("dormsettings_selected", this);
    $('#dormsettingsmodal').modal();
  }
});

Template.na_dorms.rendered = function() {
  $.material.init();
}

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
  },
  'advisors_metadata': function() {
    var adv = this.advisors;
    var out = [];
    for (var c = 0; c < adv.length; c++) {
      out.push({email: adv[c], index: c, dormid: this._id}); // shims id into this context
    }
    return out;
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
      toastr.error(err.reason, err.error); // something else happened
    });
  },
  'click #opendormsettings': function() {
    Session.set("dormsettings_selected", this);
    $('#dormremovalwarning').hide();
    $('#addadvisor_well').hide();
    $('#addadvisor_email').val('');
    $('#removeadvisor_well').hide();
    $.material.init();
    $('#dormsettingsmodal').modal();
  },
  'click #opendormremovalwarning': function() {
    $('#dormremovalwarning').fadeToggle();
  },
  'click #close_alert': function() {
    $('#dormremovalwarning').fadeOut();
  },
  'click #removedorm': function() {
    Meteor.call('removeDorm', this._id, function(err) {
      if (err == undefined) {
        $('.close').click();
        return;
      }
      if (err.error == "unauthorized") {
        toastr.error("You don't have permission to do this!", 'An error occured!');
        return;
      }
      toastr.error(err.reason, err.error); // something else happened
    });
  },
  'click #addadvisor_openwell': function() {
    $('#addadvisor_well').fadeToggle();
  },
  'click #addadvisor_button, submit #addadvisor_form': function(ev, tm) {
    ev.preventDefault();
    var dormid = this._id;
    var advemail = $('#addadvisor_email').val();
//    console.log(dormid + advemail);
    if (advemail == "") {
      toastr.warning("You need to enter an email for your new advisor.","You can't do that!");
      return;
    }
    Meteor.call('addAdvisorToDorm', dormid, advemail, function(err, ret) {
      if (err == undefined) {
          $('#addadvisor_well').fadeOut();
          var ds = Session.get('dormsettings_selected');
          ds.advisors = ret;
          Session.set('dormsettings_selected', ds);
          return;
      }
      if (err.error == 'invalidargument') {
        // assuming it's a advisor email error
        toastr.error("That doesn't appear to be a registered email.", "Unable to add advisor!");
        return;
      }
      if (err.error == 'unauthorized') {
        toastr.error("That user doesn't have permission to be an advisor.", 'Unable to add advisor!');
        return;
      }
      toastr.error(err.reason, err.error);
    });
  },
  'click #removeadvisor_openwell': function() {
    $('#removeadvisor_well').fadeToggle();
  },
  'click #removeadvisor_button': function() {
    var dormid = this.dormid;
    var email = this.email;
    var index = this.index;
    Meteor.call('removeAdvisorFromDorm', dormid, email, index, function(err, ret) {
      if (err == undefined) {
        $('#removeadvisor_well').fadeOut();
        var ds = Session.get('dormsettings_selected');
        ds.advisors = ret;
        Session.set('dormsettings_selected', ds);
        return;
      }
      toastr.toast(err.reason, err.error);
    });
  }
});

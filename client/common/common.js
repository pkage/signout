Meteor.startup(function() {
  toastr.options.positionClass = "toast-bottom-left";
  toastr.options.progressBar = true;
});

Template.registerHelper('user_email', function() {
  return ((Meteor.userId() == null) ? 'no email to show' : Meteor.user().emails[0].address);
});

Template.loginnav.rendered = function() {
  Session.set('login_hasoptions', false);
}

Template.loginnav.helpers({
  'has_options': function() {
    Meteor.call('getPermissions', function(err, ret) {
      if (err != undefined) {return;}
      if (ret.admin && (ret.grant || ret.dean || ret.house)) {
        Session.set('login_hasoptions', true);
        return;
      }
      Session.set('login_hasoptions', false);
    })
    return Session.get('login_hasoptions');
  }
});

Template.loginnav.events({
  'click #logout': function() {
    Meteor.logout();
    Router.go('login');
  }
});


Template.slip.rendered = function() {
  $.material.init();
  var expid = null;
  if (this.data.expanded == false) {
    expid = this.data.context._id;
    $('#' + expid).find('.panel-body').hide();
    $('#' + expid).find('.expando').toggleClass('hidden');
  }
  $('.datepicker').pickadate();$('.timepicker').pickatime();
  Meteor.setTimeout(function() {
    $.material.init();$('.datepicker').pickadate();$('.timepicker').pickatime();
    if (expid != null) {

    }
  }, 300);

}

Template.slip.helpers({
  'rcontext': function() {
    return Slips.findOne({});
  },
  'fill_form_with_context': function() {
    contextfill(this);
  },
  'dorms': function() {
    return Dorms.find({}, {sort: {name: 1}});
  },
  'slipfinished': function() {
    return (this.signatures.dean.signed && this.signatures.house.signed);
  },
  'dates': function() {

    var d1 = this.leave;
    var d2 = this.return;

    if (d1 == undefined || d2 == undefined) {
      return "";
    }

    return "(" + (d1.getMonth() + 1) + "/" + d1.getDate() + " - " + (d2.getMonth() + 1) + '/' + d2.getDate() + ")";
  },
  'cansign': function() {
    return (Roles.find({affects: Meteor.userId()}).count() > 0);
  }
});

Template.slip.events({
  'click .expando': function() {
    $('#' + this._id).find('.panel-body').slideToggle();
    $('#' + this._id).find('.expando').toggleClass('hidden');
  },
  'submit #slip': function(ev, tm) {
    ev.preventDefault();
    var form = $('#' + this._id);

    var obj = {
      _id: this._id,
      name: this.name,
      email: this.email,
      dorm: form.find('#dormselect').val(),
      leave: new Date(form.find('#leavedate').pickadate('picker').get() + ' ' + form.find("#leavetime").pickatime('picker').get()),
      return: new Date(form.find('#returndate').pickadate('picker').get() + ' ' + form.find("#returntime").pickatime('picker').get()),
      form: parseInt(form.find('input:radio[name="formRadio"]:checked').val()),
      address1: form.find('#slip_addr1').val(),
      address2: form.find('#slip_addr2').val(),
      state: form.find('#slip_state').val(),
      transport: form.find('#slip_transport').val(),
      zip: form.find('#slip_zip').val(),
      tel: form.find('#slip_tel').val(),
      ready: form.find('#slip_ready').is(':checked'),
      town: form.find('#slip_town').val()
    }
    Meteor.call('updateSlip', obj, function(err) {
      if (err == undefined) {
        return;
      }
      toastr.error(err.reason, err.error);
    });
  },
  'click #revert': function() {
    contextfill(this);
  },
  'click #deleteslip': function() {
    Meteor.call('removeSlip', this._id, function(err,ret) {

    });
  },
  'click #signasdean': function() {
    Meteor.call('changedean_sig', {id: this._id, state: !this.signatures.dean.signed}, function(err, ret) {
      if (err == undefined) {
        return;
      }

      console.log(err);

      toastr.error(err.reason, err.error);
    });
  },
  'click #signashouse': function() {
    Meteor.call('changehouse_sig', {id: this._id, state: !this.signatures.house.signed}, function(err, ret) {
      if (err == undefined) {
        return;
      }

      console.log(err);

      toastr.error(err.reason, err.error);
    });
  }
});

var contextfill = function(cxt) {
  //console.log('filling form with context');
  Meteor.setTimeout(function () {
    //console.log(cxt);
    $('.datepicker').pickadate();$('.timepicker').pickatime();
    var form = $('#' + cxt._id);
    form.find('#slip_name').val(cxt.name);
    form.find('#slip_email').val(cxt.email);
    form.find('input:radio[name="formRadio"]').val([cxt.form]);
    form.find('#dormselect').val(cxt.dorm);
    form.find('#leavedate').pickadate('picker').set('select', cxt.leave);
    form.find('#leavetime').pickatime('picker').set('select', cxt.leave);
    form.find('#returndate').pickadate('picker').set('select', cxt.return);
    form.find('#returntime').pickatime('picker').set('select', cxt.return);
    form.find('#slip_addr1').val(cxt.address1);
    form.find('#slip_addr2').val(cxt.address2);
    form.find('#slip_state').val(cxt.state);
    form.find('#slip_zip').val(cxt.zip);
    form.find('#slip_transport').val(cxt.transport);
    form.find('#slip_tel').val(cxt.tel);
    form.find('#slip_ready').prop('checked', cxt.ready);
    form.find('#slip_town').val(cxt.town);
    form.find('#housesig').text( ((cxt.signatures.house.signed) ? 'signed by house advisor ' + cxt.signatures.house.email : 'not signed by house advisor'));
    form.find('#deansig').text( ((cxt.signatures.dean.signed) ? 'signed by dean ' + cxt.signatures.dean.email : 'not signed by dean'));
    form.find('#signasdean').text( ((!cxt.signatures.dean.signed) ? 'sign as dean' : 'revoke dean signature') );
    form.find('#signashouse').text( ((!cxt.signatures.house.signed) ? 'sign as house advisor' : 'revoke house advisor signature') );
    $.material.init();
  }, 200);
}

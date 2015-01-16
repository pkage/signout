Template.nf_deansoffice.rendered = function() {
  $.material.init();
}

Template.nf_deansoffice.events({
  'submit #newslip': function(ev, tm) {
    ev.preventDefault();
    console.log('submitted new slip');
    var obj = {
      name: $('#gs_name').val(),
      email: $('#gs_email').val()
    };
    Meteor.call('createSlip', obj, function(err, ret) {
      if (err == undefined) {
        $('input').val('');
        toastr.success('created slip successfully');
        return;
      }
      toastr.error(err.reason, err.error);
    })
  }
})

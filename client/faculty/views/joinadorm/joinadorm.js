Template.nf_joinadorm.rendered = function() {
  $.material.init();
}

Template.nf_joinadorm.helpers({
  'mydorms': function() {
    var email = Roles.find({affects: Meteor.userId()}).fetch()[0].email;

    return Dorms.find({advisors: {$in: [email]}});
  },
  'has_dorms': function() {
    var email = Roles.findOne({affects: Meteor.userId()}).email;
    return (Dorms.find({advisors:{$in: [email]}}).count() > 0);
  },
  'alldorms': function() {
    return Dorms.find({});
  },
  'advisorcount': function() {
    return this.advisors.length;
  }
});

Template.nf_joinadorm.events({
  'click #unsubscribe': function() {
    //console.log(this);
    var email = Roles.findOne({affects: Meteor.userId()}).email;
    for (var c = 0; c < this.advisors.length; c++) {
      if (this.advisors[c] = email) {
        break;
      }
    }
    Meteor.call('removeAdvisorFromDorm', this._id, email, c, function(err, ret) {
      if (err == undefined) {
        return;
      }
      toastr.error(err.reason, err.error);
      return;
    });
  },
  'click #subscribe': function() {
    //console.log(this);
    var email = Roles.findOne({affects: Meteor.userId()}).email;
    Meteor.call('addAdvisorToDorm', this._id, email, function(err,ret) {
      if (err == undefined) {
        return;
      }
      if (err.error = 'duplicate') {
        toastr.warning("You're already subscribed to this dorm's slips!");
        return;
      }
      toastr.error(err.reason, err.error);
      return;
    });
  }
});

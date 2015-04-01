Template.nf_dorms.events({
  'click #joinadorm': function() {
    Session.set('nf_selected', 'joinadorm');
  }
});

Template.nf_dorms.helpers({
  'dorms_list': function() {
    var email = Meteor.user().emails[0].address;
    return Dorms.find({advisors: {$in: [email]}}, {sort: {name: 1}});
  },
  'has_dorms': function() {
    var email = Meteor.user().emails[0].address;
    return (Dorms.find({advisors: {$in: [email]}}).count() > 0);
  },
  'relevant_slips': function() {
    return Slips.find({dorm: this._id, ready: {$ne: false}}, {sort: {leave: 1}});
  },
  'has_relevant_slips': function() {
    return (Slips.find({dorm: this._id, ready: {$ne: false}}).count() > 0);
  }
});

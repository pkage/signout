Template.home.rendered = function() {
  Meteor.subscribe('slips');
}

Template.home.helpers({
  'hasSlips': function() {
    return (Slips.find({student: Meteor.userId()}).count() > 0);
  }
});

Template.home.events({

});

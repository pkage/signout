Template.student.rendered = function() {
	if (Meteor.userId() == null) {Router.go('login');}
}

Template.student.helpers({
	'slips': function() {
		return Slips.find({email: Meteor.user().emails[0].address});
	},
	'has_slips': function() {
		return (Slips.find({email: Meteor.user().emails[0].address}).count() > 0);
	}
});

Template.nf_overview.helpers({
	'slips': function() {
		var email;
		try {
			email = Roles.findOne({affects: Meteor.userId()}).email;
		} catch(err) {
			return;
		}
		var dorms = Dorms.find({advisors: {$in: [email]}}).fetch();
		var dout = [];
		for (var c = 0; c < dorms.length; c++) {
			dout.push({dorm: dorms[c]._id})
		}
		//console.log(dout);
		return Slips.find({$or: dout, ready: {$ne: false}});
	},
	'has_slips': function() {
		var email;
		try {
			email = Roles.findOne({affects: Meteor.userId()}).email;
		} catch (err) {
			return;
		}
		var dorms = Dorms.find({advisors: {$in: [email]}}).fetch();
		var dout = [];
		for (var c = 0; c < dorms.length; c++) {
			dout.push({dorm: dorms[c]._id})
		}
		//    return true;
		return (Slips.find({$or: dout}).count() > 0);
	}
})

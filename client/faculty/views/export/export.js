Template.nf_export.rendered = function() {
	$.material.init();
}

Template.nf_export.events({
	'click #jt3': function() {
		$('html, body').animate({scrollTop: $("#form3").offset().top}, 1000);
	},
	'click #jt4': function() {
		$('html, body').animate({scrollTop: $("#form4").offset().top}, 1000);
	},
	'click #jt5': function() {
		$('html, body').animate({scrollTop: $("#form5").offset().top}, 1000);
	},
	'click #jt6': function() {
		$('html, body').animate({scrollTop: $("#form6").offset().top}, 1000);
	}
});

Template.nf_export_table.helpers({
	'resolveDorm': function() {
		return Dorms.findOne({_id: this.dorm}).name;
	},
	'slipStatus': function() {
		var dean = this.signatures.dean.signed;
		var house = this.signatures.house.signed;
		if (!dean && !house) {
			return "no signatures";
		} else if (!dean && house) {
			return "house signature only";
		} else if (dean && !house) {
			return "dean signature only";
		} else {
			return "fully signed";
		}
	},
	'slips': function() {
		return Slips.find({form: this.form}, {sort: {leave: 1}});
	}
});

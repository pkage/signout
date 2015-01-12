Template.student.rendered = function() {
  if (Meteor.userId() == null) {Router.go('login');}
}

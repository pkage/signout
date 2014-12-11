Router.map(function() {
  this.route('splash', {
    path: '/'
  });
  this.route('home', {
    path: '/student',
    waitOn: function() {
      return Meteor.subscribe('slips');
    },
    data: function() {
      return '';
    }
  });
  this.route('admin', {
    path: '/dean'
  });
  this.route('loading', {
    path: '*'
  })
});

Router.configure({
  loadingTemplate: 'loading'
});

Router.map(function() {
  this.route('login', {
    path: '/'
  });

  this.route('admin');
  this.route('faculty');
  this.route('student');
  this.route('loading', {path: '/login'});
});

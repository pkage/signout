Router.map(function() {
  this.route('splash', {
    path: '/'
  });
  this.route('home', {
    path: '/student'
  });
  this.route('admin', {
    path: '/dean'
  });
  this.route('fourohfour', {
    path: '*'
  })
});

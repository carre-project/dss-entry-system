angular.module('CarreEntrySystem').service('Auth', function($http, CONFIG, $cookies) {

  // Retrieving a cookie and set initial user object
  this.cookie = $cookies.get('CARRE_USER') || CONFIG.TEST_TOKEN || '';
  this.user={};
  this.getUser=function(){ 
    //validate cookie token with userProfile api function and get username userGraph
    if (this.cookie.length > 0 && !this.user.username) {
      return $http.get(CONFIG.API + 'userProfile?token=' + this.cookie).then(function(res) {
        this.user = res.data;
        return this.user;
      }, function(err) {
        this.user = null;
        console.log(err);
        return this.user
      });
    } else return this.user;
  }
  
});
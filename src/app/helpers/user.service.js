angular.module('CarreEntrySystem').service('Auth', function($http, CONFIG, $cookies, $log) {

  // Retrieving a cookie and set initial user object
  this.cookie = $cookies.get('CARRE_USER') || CONFIG.TEST_TOKEN || '';
  this.user={'guest':true};
  this.getUser=function(){ 
    //validate cookie token with userProfile api function and get username userGraph
    if (this.cookie.length > 0 && !this.user.username) {
      return $http.get(CONFIG.CARRE_API_URL + 'userProfile?token=' + this.cookie).then(function(res) {
        this.user = res.data;
        return this.user;
      }, function(err) {
        this.user = {};
        $log.log(err);
        return this.user;
      });
    } else return this.user;
  };
  
});
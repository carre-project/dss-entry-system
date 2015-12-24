angular.module('CarreEntrySystem').service('Auth', function($http, CONFIG, $cookies,$state) {

  // Retrieving a cookie and set initial user object
  this.cookie = $cookies.get('CARRE_USER') || CONFIG.TEST_TOKEN || '';
  this.user={'guest':true};
  this.getUser=function(){ 
    //validate cookie token with userProfile api function and get username userGraph
    if (this.cookie.length > 0 && !this.user.username) {
      return $http.get(CONFIG.CARRE_API_URL + 'userProfile?token=' + this.cookie,{cache:true,timeout:3000}).then(function(res) {
        this.user = res.data;
        return this.user;
      }).catch(function(err) {
        this.user = {};
        console.log(err);
        $state.go('500_API_ERROR');
      });
    } else return {'guest':true};
  };
  
});
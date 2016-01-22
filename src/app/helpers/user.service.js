angular.module('CarreEntrySystem').service('Auth', function($http, CONFIG, $cookies,$state,$q) {

  // Retrieving a cookie and set initial user object
  this.cookie = $cookies.get('CARRE_USER') || CONFIG.TEST_TOKEN || '';
  this.isLoggedIn=function(){
    var deferred = $q.defer();
    if(CONFIG.currentUser.username) deferred.resolve(CONFIG.currentUser); 
    else deferred.reject(CONFIG.currentUser);
    return deferred.promise;
  }
  this.getUser=function(){
    console.log('User authentication called');
    var deferred = $q.defer();
    
    //validate cookie token with userProfile api function and get username userGraph
    if (this.cookie.length > 0) {
      $http.get(CONFIG.CARRE_API_URL + 'userProfile?token=' + this.cookie,{cache:true,timeout:5000}).then(function(res) {
        
        CONFIG.currentUser=res.data;
        //Show different graph on logged in users
        CONFIG.CARRE_DEFAULT_GRAPH=CONFIG.CARRE_ARCHIVE_GRAPH;
        
        deferred.resolve(CONFIG.currentUser);
        console.log('User authentication completed',CONFIG.currentUser);
      }).catch(function(err) {
        CONFIG.currentUser = {};
        deferred.reject(err);
        $state.go('500_API_ERROR');
      });
    } else {  
      CONFIG.currentUser={'guest':true};
      deferred.resolve(CONFIG.currentUser);
      console.log('User not logged in',CONFIG.currentUser);
    }
    
    return deferred.promise;
  };
});
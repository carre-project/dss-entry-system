angular.module('CarreEntrySystem').service('Auth', function($http, CONFIG, $cookies,$state,$q,$timeout, Email, $location, $window) {

  // Retrieving a cookie and set initial user object
  this.cookie = $cookies.get('CARRE_USER') || CONFIG.TEST_TOKEN || '';
  this.isLoggedIn=function(){
    var deferred = $q.defer();
    if(CONFIG.currentUser.role) deferred.resolve(CONFIG.currentUser); 
    else if(CONFIG.currentUser.guest) deferred.reject('Guest users not allowed to do this!'); 
    else this.getUser().then(function(){
        $timeout(function(){
          if(CONFIG.currentUser.role) deferred.resolve(CONFIG.currentUser); 
          else if(CONFIG.currentUser.guest) deferred.reject('Guest users not allowed to do this!'); 
        },200);
      });
    return deferred.promise;
  };
  this.getUser=function(){
    console.log('User authentication called');
    var deferred = $q.defer();
    
    if(CONFIG.currentUser.role||CONFIG.currentUser.guest) deferred.resolve(CONFIG.currentUser);
    //validate cookie token with userProfile api function and get username userGraph
    else if (this.cookie.length > 0) {
      $http.get(CONFIG.CARRE_API_URL + 'userProfile?token=' + this.cookie,{cache:true,timeout:5000}).then(function(res) {
        
        //check if virtuoso is down
        if (res.data.error) {
          Email.bug({data:CONFIG.CARRE_DEVICES+'logout?next='+$location.absUrl(),title:"Invalid Token, Redirect url"});
          $window.location.href=CONFIG.CARRE_DEVICES+'logout?next='+$location.absUrl();
          CONFIG.currentUser = {'guest':true};
          console.log(res.data.error);
        } else if (res.data.username.indexOf("(")===0) {
            Email.bug({data:res.data,title:"RDF server is down"});
            CONFIG.currentUser = {'guest':true};
        } else if (!res.data.role) {
            Email.bug({data:res.data,title:"User is not a doctor"});
            console.warn("User is not a doctor",res);
            CONFIG.currentUser = {'guest':true};
        } else {
        
          CONFIG.currentUser=res.data;
          //Show different graph on logged in users
          CONFIG.CARRE_DEFAULT_GRAPH=CONFIG.CARRE_ARCHIVE_GRAPH;
          console.log('User authentication completed',CONFIG.currentUser);
          
        }
        deferred.resolve(CONFIG.currentUser);
        // Set the user ID using signed-in user_id.
        // for GOOGLE Analytics
        // ga('set', 'userId', CONFIG.currentUser.username);
        // ga('set', 'dimension3', CONFIG.currentUser.username);
        
        
      }).catch(function(err) {
        CONFIG.currentUser = {};
        deferred.reject(err);
        Email.bug(err);
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
(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .constant("CONFIG", {
      "currentUser":{},
      "USECACHE":true,
      "ENV": "DEV",
      "CARRE_API_URL": "http://devices.carre-project.eu/ws/",
      "CARRE_CACHE_URL": "http://beta.carre-project.eu:3002/"
    })
    .config(function($locationProvider, $compileProvider, $urlRouterProvider) {

      //show home page on error
      $urlRouterProvider.otherwise( function($injector) {
        var $state = $injector.get("$state");
        $state.go('main.dashboard');
      });
      
      //Set url handler  
      $locationProvider.html5Mode(false);

      // Enable log
      $compileProvider.debugInfoEnabled(true);
    });

})();

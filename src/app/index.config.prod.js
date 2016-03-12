(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .constant("CONFIG", {    
      "currentUser":{},
      "USECACHE":true,
      "ENV": "PROD",
      "CARRE_API_URL": "https://carre.kmi.open.ac.uk/ws/",
      "CARRE_CACHE_URL": "https://cache.carre-project.eu/"
    }).config(function($locationProvider, $compileProvider, $urlRouterProvider) {
      
      //show error
      $urlRouterProvider.otherwise( function($injector) {
        var $state = $injector.get("$state");
        $state.go('404_error');
      });
      
      //Set url handler  
      $locationProvider.html5Mode(true);
      
      // Disable log
      $compileProvider.debugInfoEnabled(false);
    });

})();

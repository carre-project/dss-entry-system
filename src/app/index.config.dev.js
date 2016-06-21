(function() {
  'use strict';

  window.CARRE_ENTRY_SYSTEM_CONFIGURATION = {
    language:'en',
    api_url:'https://carre.kmi.open.ac.uk/ws/',
    authentication_url:'https://devices.carre-project.eu/devices/accounts/',
    graph_url:'http://carre.kmi.open.ac.uk/'
  };
  
  
  angular
    .module('CarreEntrySystem')
    .constant("CONFIG", {
      "currentUser":{},
      "USECACHE":false,
      "AllowDelete":true,
      "useOfflineMode":true,
      "ENV": "DEV",
      "CARRE_API_URL": window.CARRE_ENTRY_SYSTEM_CONFIGURATION.api_url,
      "CARRE_CACHE_URL": window.CARRE_ENTRY_SYSTEM_CONFIGURATION.cache_url
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
      
      
      //load the google analytics only in production

      
      
    });

})();

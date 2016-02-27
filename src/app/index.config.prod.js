(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .constant("CONFIG", {    
      "currentUser":{},
      'ENV': 'PROD'
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

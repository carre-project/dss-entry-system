/* global malarkey:false */
(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .constant('malarkey', malarkey)
    .constant("CONFIG", {
      "API": "//devices.carre-project.eu/ws/",
      "CARRE_DEVICES": "http://devices.carre-project.eu/devices/accounts/",
      // "TEST_TOKEN": "0213be219dc1821eb2f7b0bbc7c8a6cbe3c3559b",
      'ENV': 'DEV'
    })
    .config(function($locationProvider, $logProvider) {

      //Set url handler  
      $locationProvider.html5Mode(false);

      // Enable log
      $logProvider.debugEnabled(true);

    });

})();

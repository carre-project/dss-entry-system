/* global malarkey:false */
(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .constant('malarkey', malarkey)
    .constant("CONFIG", {
      "API": "//devices.carre-project.eu/ws/",
      "CARRE_DEVICES": "//devices.carre-project.eu/devices/accounts/",
      'ENV': 'PROD'
    }).config(function($locationProvider, $logProvider, $compileProvider) {
    
      //Set url handler  
      $locationProvider.html5Mode(true);
    
      // Disable log
      $logProvider.debugEnabled(false);
      $compileProvider.debugInfoEnabled(false);
    });
  
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
ga('create', 'UA-XXXXX-X');
ga('send', 'pageview');

})();

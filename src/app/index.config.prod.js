/* global malarkey:false */
(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .constant('malarkey', malarkey)
    .constant("CONFIG", {
      "CARRE_API_URL": "https://carre.kmi.open.ac.uk/ws/",
      "CARRE_DEVICES": "//devices.carre-project.eu/devices/accounts/",
      "BIOPORTAL_API_URL": "//data.bioontology.org/",
      "BIOPORTAL_API_KEY": "a15281a9-d87d-4c0f-b7aa-31debe0f6449",
      "PUBMED_API_URL": "//eutils.ncbi.nlm.nih.gov/entrez/eutils/",
      'ENV': 'PROD'
    }).config(function($locationProvider, $logProvider, $compileProvider, $urlRouterProvider) {
      
      //show error
      $urlRouterProvider.otherwise('/404_error');
      
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
ga('create', 'UA-60507179-2');
ga('send', 'pageview');

})();

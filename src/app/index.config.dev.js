/* global malarkey:false */
(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .constant("CONFIG", {
      "CARRE_API_URL": "https://carre.kmi.open.ac.uk/ws/",
      "CARRE_DEVICES": "//devices.carre-project.eu/devices/accounts/",
      "BIOPORTAL_API_URL": "//data.bioontology.org/",
      "BIOPORTAL_API_KEY": "a15281a9-d87d-4c0f-b7aa-31debe0f6449",
      "PUBMED_API_URL": "//eutils.ncbi.nlm.nih.gov/entrez/eutils/",
      // "TEST_TOKEN": "0213be219dc1821eb2f7b0bbc7c8a6cbe3c3559b",
      'ENV': 'DEV'
    })
    .config(function($locationProvider, $logProvider, $compileProvider, $urlRouterProvider) {

      //show home page on error
      $urlRouterProvider.otherwise('/');
      
      //Set url handler  
      $locationProvider.html5Mode(false);

      // Enable log
      $logProvider.debugEnabled(true);
      $compileProvider.debugInfoEnabled(true);
    });

})();

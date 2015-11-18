(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .constant("CONFIG", {
      "CARRE_API_URL": "//devices.carre-project.eu/ws/",
      "CARRE_SPARQL_ENDPOINT": "//devices.carre-project.eu:8890/sparql",
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

})();

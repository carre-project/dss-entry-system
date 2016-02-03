(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .constant("CONFIG", {
      "CARRE_API_URL": "http://devices.carre-project.eu/ws/",
      "CARRE_DEFAULT_GRAPH": "<http://carre.kmi.open.ac.uk/public>",
      "CARRE_ARCHIVE_GRAPH": "<http://carre.kmi.open.ac.uk/riskdata>",
      "CARRE_DEVICES": "http://devices.carre-project.eu/devices/accounts/",
      "BIOPORTAL_API_URL": "https://data.bioontology.org/",
      "BIOPORTAL_API_KEY": "a15281a9-d87d-4c0f-b7aa-31debe0f6449",
      "PUBMED_API_URL": "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/",     
      "currentUser":{'guest':true},
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

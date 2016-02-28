(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .config(config);

  /** @ngInject */
  function config(toastrConfig, $httpProvider, cfpLoadingBarProvider,CONFIG) {
    
    //DEFAULT CONFIGURATION
    CONFIG.CARRE_API_URL="http://devices.carre-project.eu/ws/";
    CONFIG.CARRE_DEFAULT_GRAPH="<http://carre.kmi.open.ac.uk/public>";
    CONFIG.CARRE_ARCHIVE_GRAPH="<http://carre.kmi.open.ac.uk/riskdata>";
    CONFIG.CARRE_DEVICES="http://devices.carre-project.eu/devices/accounts/";
    CONFIG.CARRE_CACHE_URL="http://beta.carre-project.eu:3002/";
    // CONFIG.TEST_TOKEN="0213be219dc1821eb2f7b0bbc7c8a6cbe3c3559b";
    
    //EXTERNAL API'S
    CONFIG.BIOPORTAL_API_URL="http://data.bioontology.org/";
    CONFIG.BIOPORTAL_API_KEY="a15281a9-d87d-4c0f-b7aa-31debe0f6449";
    CONFIG.BIOPORTAL_ONTOLOGIES="ICD10,ICD10CM";//",ICD10CM,ICD10PCS,ICD9CM";
    CONFIG.PUBMED_API_URL="https://eutils.ncbi.nlm.nih.gov/entrez/eutils/";
    CONFIG.EUROPEPMC_API_URL="http://www.ebi.ac.uk/europepmc/webservices/rest/";
    
    //Client caching
    CONFIG.CACHED_QUERIES={};
    
    // Set options third-party lib
    CONFIG.OPTIONS={
      usePrefix:true
    };
    
    //chart colors
    CONFIG.COLORS=["#46BFBD", "#2E8B57", "#F7464A", "#DB7093", "#FDB45C", "#949FB1", "#4D5360"]
    Chart.defaults.global.colours=CONFIG.COLORS;
    
    //toaster notification
    angular.extend(toastrConfig, {
      allowHtml: true,
      closeButton: false,
      closeHtml: '<button>&times;</button>',
      extendedTimeOut: 1000,
      iconClasses: {
        error: 'toast-error',
        info: 'toast-info',
        success: 'toast-success',
        warning: 'toast-warning'
      },
      positionClass: 'toast-top-right',
      messageClass: 'toast-message',
      onHidden: null,
      onShown: null,
      onTap: null,
      preventDuplicates: false,
      progressBar: false,
      tapToDismiss: true,
      // templates: {
      //   toast: 'directives/toast/toast.html',
      //   progressbar: 'directives/progressbar/progressbar.html'
      // },
      timeOut: 4000,
      titleClass: 'toast-title',
      toastClass: 'toast'
    });

    cfpLoadingBarProvider.spinnerTemplate = '<div style="position:absolute; top:-80px; z-index:99999; left:49%"><div class="loader">Loading...</div></div>';
    cfpLoadingBarProvider.latencyThreshold = 600;
    // cfpLoadingBarProvider.includeBar = false;



    //fix 500 and -1 errors
    $httpProvider.interceptors.push(function($q, $injector) {
      var incrementalTimeout = 500;

      function retryRequest(httpConfig) {
        var $timeout = $injector.get('$timeout');
        incrementalTimeout *= 2;
        return $timeout(function() {
          var $http = $injector.get('$http');
          return $http(httpConfig);
        }, incrementalTimeout);
      }

      return {
        request: function(config) {
          return config;
        },
        requestError: function(request) {
          console.warn('Error on request: ', request);
          return request;
        },
        responseError: function(response) {

          if (response.status === 500 || response.status === -1) {


            console.warn('Weird API 500 error intercepted! : ', response);
            if (incrementalTimeout < 10000) {
              return retryRequest(response.config);
            }
            else {
              // document.location.href = '/500_API_ERROR';
              console.log('The remote server seems to be busy at the moment. Please try again in 5 minutes');
            }
          }
          else {
            incrementalTimeout = 500;
          }
          return $q.reject(response);
        }
      };
    });


  }

})();

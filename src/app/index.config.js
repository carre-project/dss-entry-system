(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .config(config);

  /** @ngInject */
  function config(toastrConfig, $httpProvider, cfpLoadingBarProvider,CONFIG) {
    
    //DEFAULT CONFIGURATION
    CONFIG.CARRE_DEFAULT_GRAPH="<http://carre.kmi.open.ac.uk/public>";
    CONFIG.CARRE_ARCHIVE_GRAPH="<http://carre.kmi.open.ac.uk/riskdata>";
    CONFIG.CARRE_DEVICES="http://devices.carre-project.eu/devices/accounts/";
    // CONFIG.TEST_TOKEN="0213be219dc1821eb2f7b0bbc7c8a6cbe3c3559b";
    
    //EXTERNAL API'S
    CONFIG.BIOPORTAL_API_URL="https://data.bioontology.org/";
    CONFIG.BIOPORTAL_API_KEY="a15281a9-d87d-4c0f-b7aa-31debe0f6449";
    CONFIG.BIOPORTAL_ONTOLOGIES="ICD10,ICD10CM";//",ICD10CM,ICD10PCS,ICD9CM";
    CONFIG.PUBMED_API_URL="https://eutils.ncbi.nlm.nih.gov/entrez/eutils/";
    CONFIG.EUROPEPMC_API_URL="https://www.ebi.ac.uk/europepmc/webservices/rest/";
    
    //Client caching
    CONFIG.CACHED_QUERIES={};
    
    // Set options third-party lib
    CONFIG.OPTIONS={
      usePrefix:true
    };
    
    //chart colors
    // var jnnnColors=["#e08526", "#a118fb", "#2f739c", "#2db315", "#fb64b0", "#27af8d", "#4663db", "#706f42", "#ba4645", "#b68bce", "#ad36bc", "#ac9c1f", "#b3948f", "#2b7d1a", "#d32528", "#ad4a80", "#8f6521", "#4ea8ad", "#87a64a", "#3d7860", "#77687f", "#ea7790", "#fe4df0", "#cb2964", "#9d5962", "#f57550", "#d78670", "#4858fb", "#7499ee", "#c37eef", "#6f60bc", "#9a3cdb", "#7ca66d", "#107d40", "#3e6cbb", "#6ba78d", "#f067d0", "#939f8e", "#4f7741", "#bd4525", "#c52d81", "#c3924d", "#22a3ee", "#54717e", "#657061", "#58771c", "#d02747", "#766f1e", "#c589af", "#7d43fb", "#a696ae", "#81a0ae", "#8b6543", "#0d797e", "#69ad18", "#4dae6c", "#5fad49", "#a14c9e", "#8ea51c", "#c79223", "#a79d4b", "#bd936f", "#836661", "#9f9e6e", "#e26af0", "#65a1ce", "#63699d", "#a75823", "#935b7f", "#dd854e", "#9297ce", "#914fbc", "#d47bcf", "#b54863", "#d0878f", "#f17671", "#a08def", "#7753db", "#bb319e", "#e179af", "#f9742a", "#a35844", "#855d9d"]
    var myColors = ["#46BFBD", "#F7464A","#2E8B57", "#DB7093", "#FDB45C", "#949FB1", "#4D5360",'#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f','#ff7f00','#cab2d6','#6a3d9a','#ffff99','#b15928'];
    // ["#46BFBD", "#F7464A","#2E8B57", "#DB7093", "#FDB45C", "#949FB1", "#4D5360"]
    
    CONFIG.COLORS=myColors.concat(d3.scale.category20().range()); //mix the 20 default d3 color palette so you have almost 40
    Chart.defaults.global.colours=CONFIG.COLORS.map(function(color){return { fillColor: color }; });
    
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

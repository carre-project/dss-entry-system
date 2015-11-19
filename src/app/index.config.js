(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .config(config);

  /** @ngInject */
  function config(toastrConfig, $httpProvider, cfpLoadingBarProvider) {
    // Set options third-party lib
    toastrConfig.allowHtml = true;
    toastrConfig.timeOut = 3000;
    toastrConfig.positionClass = 'toast-top-right';
    toastrConfig.preventDuplicates = true;
    toastrConfig.progressBar = false;

    // for enabling cross-domain request
    // delete $httpProvider.defaults.headers.common['X-Requested-With'];

    cfpLoadingBarProvider.spinnerTemplate = '<div style="position:absolute; top:-80px; z-index:99999; left:49%"><div class="loader">Loading...</div></div>';
    cfpLoadingBarProvider.latencyThreshold = 300;
    // cfpLoadingBarProvider.includeBar = false;



    //fix 500 errors
    $httpProvider.interceptors.push(function($q, $injector) {
      var incrementalTimeout = 1000;

      function retryRequest(httpConfig) {
        var $timeout = $injector.get('$timeout');
        return $timeout(function() {
          var $http = $injector.get('$http');
          return $http(httpConfig);
        }, incrementalTimeout);
        incrementalTimeout *= 2;
      };

      return {
        responseError: function(response) {
          if (response.status === 500) {
            if (incrementalTimeout < 5000) {
              return retryRequest(response.config);
            }
            else {
              console.log('The remote server seems to be busy at the moment. Please try again in 5 minutes');
            }
          }
          else {
            incrementalTimeout = 1000;
          }
          return $q.reject(response);
        }
      };
    });


  }

})();

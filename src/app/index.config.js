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
    cfpLoadingBarProvider.latencyThreshold = 600;
    // cfpLoadingBarProvider.includeBar = false;



    //fix 500 and -1 errors
    $httpProvider.interceptors.push(function($q, $injector) {
      var incrementalTimeout = 100;
      var $log=$injector.get('$log');
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
        requestError:function(request){
          $log.warn('Error on request: ',request);
          return request;
        },
        responseError: function(response) {
          
          if (response.status === 500||response.status===-1) {
            
          
          $log.warn('Weird API 500 error intercepted! : ',response);
            if (incrementalTimeout < 4000) {
              return retryRequest(response.config);
            }
            else {
              $log.log('The remote server seems to be busy at the moment. Please try again in 5 minutes');
            }
          }
          else {
            incrementalTimeout = 200;
          }
          return $q.reject(response);
        }
      };
    });


  }

})();

(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .config(config);

  /** @ngInject */
  function config(toastrConfig, $httpProvider, cfpLoadingBarProvider) {
    
    // Set options third-party lib
    
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
      var incrementalTimeout = 100;

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
            if (incrementalTimeout < 4000) {
              return retryRequest(response.config);
            }
            else {
              console.log('The remote server seems to be busy at the moment. Please try again in 5 minutes');
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

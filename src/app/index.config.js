(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .config(config);

  /** @ngInject */
  function config(toastrConfig,$httpProvider,cfpLoadingBarProvider) {
    // Set options third-party lib
    toastrConfig.allowHtml = true;
    toastrConfig.timeOut = 3000;
    toastrConfig.positionClass = 'toast-top-right';
    toastrConfig.preventDuplicates = true;
    toastrConfig.progressBar = false;
    
		// for enabling cross-domain request
		// delete $httpProvider.defaults.headers.common['X-Requested-With'];
		
    cfpLoadingBarProvider.spinnerTemplate = '<div style="position:absolute; top:-80px; left:45%"><div class="loader">Loading...</div></div>';
		// cfpLoadingBarProvider.latencyThreshold = 0;
		// cfpLoadingBarProvider.includeBar = false;
  }

})();

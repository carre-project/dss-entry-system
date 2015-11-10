(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .config(config);

  /** @ngInject */
  function config(toastrConfig,$httpProvider) {
    // Set options third-party lib
    toastrConfig.allowHtml = true;
    toastrConfig.timeOut = 3000;
    toastrConfig.positionClass = 'toast-top-right';
    toastrConfig.preventDuplicates = true;
    toastrConfig.progressBar = true;
    
		// for enabling cross-domain request
		// delete $httpProvider.defaults.headers.common['X-Requested-With'];
		
  }

})();

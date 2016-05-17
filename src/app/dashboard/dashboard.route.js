/*global angular*/
(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider) {
    
    $stateProvider
      .state('main.dashboard', {
        controller: 'DashboardController',
        controllerAs: 'dashboard',
        url: '/',
        templateUrl: 'app/dashboard/index.html'
      });
  }

})();

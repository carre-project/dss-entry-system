/*global angular*/
(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider) {
    
    $stateProvider
     
      /*  risk_factors  */
      .state('main.risk_factors', {
        'abstract':true,
        templateUrl: 'app/risk_factors/main.html',
        url: '/risk_factors'
      })
      .state('main.risk_factors.list', {
        controller: 'risk_factorsController',
        controllerAs: 'risk_factors',
        templateUrl: 'app/risk_factors/list.html',
        url: ''
      })
      .state('main.risk_factors.create', {
        templateUrl: 'app/risk_factors/single/single.html',
        controller: 'risk_factorsSingleController',
        controllerAs: 'risk_factor',
        url: '/create',
        data: {
          permissions: {
            only: ['authenticated_user'],
            redirectTo: function(rejectedPromise) {
              window.location.replace(window.location.href.replace('/edit','').replace('/create',''));
            }        
            
          }
        }
      })
      .state('main.risk_factors.edit', {
        templateUrl: 'app/risk_factors/single/single.html',
        controller: 'risk_factorsSingleController',
        controllerAs: 'risk_factor',
        url: '/:id/edit',
        data: {
          permissions: {
            only: ['authenticated_user'],
            redirectTo: function(rejectedPromise) {
              window.location.replace(window.location.href.replace('/edit','').replace('/create',''));
            }        
            
          }
        }
        
      })
      .state('main.risk_factors.view', {
        controller: 'risk_factorsSingleController',
        templateUrl: 'app/risk_factors/single/single.html',
        controllerAs: 'risk_factor',
        url: '/:id'
      });
  }

})();

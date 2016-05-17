/*global angular*/
(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider) {
    
    
    $stateProvider
  
      /*  risk_evidences  */
      .state('main.risk_evidences', {
        'abstract':true,
        templateUrl: 'app/risk_evidences/main.html',
        url: '/risk_evidences'
      })
      .state('main.risk_evidences.list', {
        controller: 'risk_evidencesController',
        controllerAs: 'risk_evidences',
        templateUrl: 'app/risk_evidences/list.html',
        url: ''
      })
      .state('main.risk_evidences.create', {
        templateUrl: 'app/risk_evidences/single/single.html',
        controller: 'risk_evidencesSingleController',
        controllerAs: 'risk_evidence',
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
      .state('main.risk_evidences.edit', {
        templateUrl: 'app/risk_evidences/single/single.html',
        controller: 'risk_evidencesSingleController',
        controllerAs: 'risk_evidence',
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
      .state('main.risk_evidences.view', {
        controller: 'risk_evidencesSingleController',
        templateUrl: 'app/risk_evidences/single/single.html',
        controllerAs: 'risk_evidence',
        url: '/:id'
      });
  }

})();

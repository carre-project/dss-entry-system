/*global angular*/
(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider) {
    
    
    $stateProvider
  
      /*  risk_alerts  */
      .state('main.risk_alerts', {
        'abstract':true,
        templateUrl: 'app/pages/risk_alerts/main.html',
        url: '/risk_alerts'
      })
      .state('main.risk_alerts.list', {
        controller: 'risk_alertsController',
        controllerAs: 'risk_alerts',
        templateUrl: 'app/pages/risk_alerts/list.html',
        url: ''
      })
      .state('main.risk_alerts.create', {
        templateUrl: 'app/pages/risk_alerts/single/single.html',
        controller: 'risk_alertsSingleController',
        controllerAs: 'risk_alert',
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
      .state('main.risk_alerts.edit', {
        templateUrl: 'app/pages/risk_alerts/single/single.html',
        controller: 'risk_alertsSingleController',
        controllerAs: 'risk_alert',
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
      .state('main.risk_alerts.view', {
        controller: 'risk_alertsSingleController',
        templateUrl: 'app/pages/risk_alerts/single/single.html',
        controllerAs: 'risk_alert',
        url: '/:id'
      });
  }

})();

/*global angular*/
(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider) {
  
    $stateProvider

      /*  Observables  */
      .state('main.observables', {
        'abstract':true,
        templateUrl: 'app/observables/main.html',
        url: '/observables'
      })
      .state('main.observables.list', {
        controller: 'observablesController',
        controllerAs: 'observables',
        templateUrl: 'app/observables/list.html',
        url: ''
      })
      .state('main.observables.view', {
        controller: 'observablesSingleController',
        templateUrl: 'app/observables/single/single.html',
        controllerAs: 'observable',
        url: '/:id'
      })
      .state('main.observables.create', {
        templateUrl: 'app/observables/single/single.html',
        controller: 'observablesSingleController',
        controllerAs: 'observable',
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
      .state('main.observables.edit', {
        templateUrl: 'app/observables/single/single.html',
        controller: 'observablesSingleController',
        controllerAs: 'observable',
        url: '/:id/edit',
        data: {
          permissions: {
            only: ['authenticated_user'],
            redirectTo: function(rejectedPromise) {
              window.location.replace(window.location.href.replace('/edit','').replace('/create',''));
            }        
            
          }
        }
        
      });
  }

})();

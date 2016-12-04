/*global angular*/
(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider) {
  
    $stateProvider

      /*  Calculated_observables  */
      .state('main.calculated_observables', {
        'abstract':true,
        templateUrl: 'app/pages/calculated_observables/main.html',
        url: '/calculated_observables'
      })
      .state('main.calculated_observables.list', {
        controller: 'calculatedObservablesController',
        controllerAs: 'calculated_observables',
        templateUrl: 'app/pages/calculated_observables/list.html',
        url: ''
      })
      .state('main.calculated_observables.create', {
        templateUrl: 'app/pages/calculated_observables/single/single.html',
        controller: 'observablesSingleController',
        controllerAs: 'calculated_observable',
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
      .state('main.calculated_observables.edit', {
        templateUrl: 'app/pages/calculated_observables/single/single.html',
        controller: 'observablesSingleController',
        controllerAs: 'calculated_observable',
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
      .state('main.calculated_observables.view', {
        controller: 'observablesSingleController',
        templateUrl: 'app/pages/calculated_observables/single/single.html',
        controllerAs: 'calculated_observable',
        url: '/:id'
      });
  }

})();

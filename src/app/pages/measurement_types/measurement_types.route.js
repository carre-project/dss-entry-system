/*global angular*/
(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider) {
    
    $stateProvider
    
      /*  Measurement Types  */
      .state('main.measurement_types', {
        'abstract':true,
        templateUrl: 'app/pages/measurement_types/main.html',
        url: '/measurement_types'
      })
      .state('main.measurement_types.list', {
        controller: 'measurement_typesController',
        controllerAs: 'measurement_types',
        templateUrl: 'app/pages/measurement_types/list.html',
        url: ''
      })
      .state('main.measurement_types.create', {
        templateUrl: 'app/pages/measurement_types/single/single.html',
        controller: 'measurement_typesSingleController',
        controllerAs: 'measurement_type',
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
      .state('main.measurement_types.edit', {
        templateUrl: 'app/pages/measurement_types/single/single.html',
        controller: 'measurement_typesSingleController',
        controllerAs: 'measurement_type',
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
      .state('main.measurement_types.view', {
        controller: 'measurement_typesSingleController',
        templateUrl: 'app/pages/measurement_types/single/single.html',
        controllerAs: 'measurement_type',
        url: '/:id'
      });
  }

})();

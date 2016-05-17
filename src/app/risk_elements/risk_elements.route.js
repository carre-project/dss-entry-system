/*global angular*/
(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider) {
   
    $stateProvider
    
      /*  Risk Elements  */
      .state('main.risk_elements', {
        'abstract':true,
        templateUrl: 'app/risk_elements/main.html',
        controller: 'risk_elementsController',
        controllerAs: 'risk_elements',
        url: '/risk_elements'
      })
      .state('main.risk_elements.list', {
        templateUrl: 'app/risk_elements/list.html',
        controller: 'risk_elementsController',
        controllerAs: 'risk_elements',
        url: ''
      })
      .state('main.risk_elements.view', {
        templateUrl: 'app/risk_elements/single/single.html',
        controller: 'risk_elementsSingleController',
        controllerAs: 'risk_element',
        url: '/:id'
      })
      .state('main.risk_elements.create', {
        templateUrl: 'app/risk_elements/single/single.html',
        controller: 'risk_elementsSingleController',
        controllerAs: 'risk_element',
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
      .state('main.risk_elements.edit', {
        templateUrl: 'app/risk_elements/single/single.html',
        controller: 'risk_elementsSingleController',
        controllerAs: 'risk_element',
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

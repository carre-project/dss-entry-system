/*global angular*/
(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider) {
    
    $stateProvider
    
      /*  Citations  */
      .state('main.citations', {
        'abstract':true,
        templateUrl: 'app/citations/main.html',
        url: '/citations'
      })
      .state('main.citations.list', {
        controller: 'citationsController',
        controllerAs: 'citations',
        templateUrl: 'app/citations/list.html',
        url: ''
      })
      .state('main.citations.create', {
        templateUrl: 'app/citations/single/single.html',
        controller: 'citationsSingleController',
        controllerAs: 'citation',
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
      .state('main.citations.createWithId', {
        templateUrl: 'app/citations/single/single.html',
        controller: 'citationsSingleController',
        controllerAs: 'citation',
        url: '/create/:pubmedId',
        data: {
          permissions: {
            only: ['authenticated_user'],
            redirectTo: function(rejectedPromise) {
              window.location.replace(window.location.href.replace('/edit','').replace('/create',''));
            }        
            
          }
        }
      })
      .state('main.citations.edit', {
        templateUrl: 'app/citations/single/single.html',
        controller: 'citationsSingleController',
        controllerAs: 'citation',
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
      .state('main.citations.view', {
        controller: 'citationsSingleController',
        templateUrl: 'app/citations/single/single.html',
        controllerAs: 'citation',
        url: '/:id'
      });
  }

})();

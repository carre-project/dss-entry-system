/*global angular*/
(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider) {

    $stateProvider
      .state('main', {
        'abstract': true,
        controller: 'MainController',
        controllerAs: 'main',
        templateUrl: 'app/main/main.html',
        resolve: {
          'currentUser': function(Auth) {
            return Auth.getUser();
          }
        }
      })
      .state('main.dashboard', {
        controller: 'MainController',
        controllerAs: 'main',
        url: '/',
        templateUrl: 'app/main/dashboard.html'
      })
      .state('main.citations', {
        'abstract':true,
        controller: 'citationsController',
        controllerAs: 'citations',
        templateUrl: 'app/citations/main.html'
      })
      .state('main.citations.list', {
        templateUrl: 'app/citations/list.html',
        url: '/citations'
      })
      .state('main.citations.edit', {
        templateUrl: 'app/citations/single/edit.html',
        controller: 'citationsSingleController',
        controllerAs: 'citation',
        url: '/citations/:id/edit'
      })
      .state('main.citations.view', {
        templateUrl: 'app/citations/single/view.html',
        controller: 'citationsSingleController',
        controllerAs: 'citation',
        url: '/citations/:id'
      })
      
      .state('500_error', {
        templateUrl: '500.html',
        url: '/500_error'
      })
      .state('404_error', {
        templateUrl: '404.html',
        url: '/404_error'
      });
  }

})();

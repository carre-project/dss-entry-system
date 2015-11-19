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
      
      /*  Citations  */
      .state('main.citations', {
        'abstract':true,
        controller: 'citationsController',
        controllerAs: 'citations',
        templateUrl: 'app/citations/main.html',
        url: '/citations'
      })
      .state('main.citations.list', {
        templateUrl: 'app/citations/list.html',
        url: ''
      })
      .state('main.citations.create', {
        templateUrl: 'app/citations/single/edit.create.html',
        controller: 'citationsSingleController',
        controllerAs: 'citation',
        url: '/create'
      })
      .state('main.citations.edit', {
        templateUrl: 'app/citations/single/edit.create.html',
        controller: 'citationsSingleController',
        controllerAs: 'citation',
        url: '/:id/edit'
      })
      .state('main.citations.view', {
        controller: 'citationsSingleController',
        templateUrl: 'app/citations/single/view.html',
        controllerAs: 'citation',
        url: '/:id'
      })
      .state('404_error', {
        templateUrl: '404.html',
        url: '/404_error'
      });
  }

})();

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
        templateUrl: 'app/main.html',
        resolve:{
          'currentUser':function(Auth){
            return Auth.getUser();
          }
        }
      })
      
      /*Error routes*/
      .state('404_error', {
        templateUrl: '404.html',
        url: '/404_error'
      })
      .state('500_API_ERROR', {
        templateUrl: '500_API.html',
        url: '/500_api_error'
      });
  }

})();

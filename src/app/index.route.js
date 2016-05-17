/*global angular*/
(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider) {
    
    
    //Perform route permission check without angular-permission module
    // function _skipIfAuthenticated($q, $state, $auth) {
    //   var defer = $q.defer();
    //   if ($auth.authenticate()) {
    //     defer.reject(); /* (1) */
    //   }
    //   else {
    //     defer.resolve(); /* (2) */
    //   }
    //   return defer.promise;
    // }

    // function _redirectIfNotAuthenticated($q, $state, $auth) {
    //   var defer = $q.defer();
    //   if ($auth.authenticate()) {
    //     defer.resolve(); /* (3) */
    //   }
    //   else {
    //     $timeout(function() {
    //       $state.go(‘login’); /* (4) */
    //     });
    //     defer.reject();
    //   }
    //   return defer.promise;
    // }
    

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

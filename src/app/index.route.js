(function() {
  'use strict';

  angular
    .module('CarreEntrySystem')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    
        
    $stateProvider
      .state('main', {
        url: '',
        controller: 'MainController',
        controllerAs: 'main',
        templateUrl: 'app/main/main.html',
        resolve: {
          'currentUser':function(Auth){
            return Auth.getUser();
          }
        }
      })
      .state('main.dashboard', {
        url: '/dashboard',
        templateUrl: 'app/main/dashboard.html',
        resolve: {
        }
      })
      .state('main.citations', {
        controller: 'CitationsController',
        controllerAs: 'citations',
        templateUrl: 'app/citations/listcitations.html',
        url: '/citations'
      })
      .state('main.blank', {
        templateUrl: 'app/views/pages/blank.html',
        url: '/blank'
      })
      .state('login', {
        templateUrl: 'app/views/pages/login.html',
        url: '/login'
      })
      .state('main.table', {
        templateUrl: 'app/views/table.html',
        url: '/table'
      })
      .state('500_error', {
        templateUrl: '500.html',
        url: '/500_error'
      })
      .state('404_error', {
        templateUrl: '404.html',
        url: '/404_error'
      });
      
    
    
    // $stateProvider
    //   .state('home', {
    //     url: '/',
    //     templateUrl: 'app/main/main.html',
    //     controller: 'MainController',
    //     controllerAs: 'main'
    //   });
 //$urlRouterProvider.otherwise('404_error');
    $urlRouterProvider.otherwise('/dashboard');
  }

})();
